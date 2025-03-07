/**
 * This file contains functions to retrieve a graph of data from the database
 */
const async = require('async');
const {R4SearchQueryCreator} = require('../query/r4');
const env = require('var');
const {getFieldNameForSearchParameter} = require('../../searchParameters/searchParameterHelpers');
const {escapeRegExp} = require('../../utils/regexEscaper');
const {assertTypeEquals} = require('../../utils/assertType');
const {DatabaseQueryFactory} = require('../../dataLayer/databaseQueryFactory');
const {SecurityTagManager} = require('../common/securityTagManager');
const {ResourceEntityAndContained} = require('./resourceEntityAndContained');
const {NonResourceEntityAndContained} = require('./nonResourceEntityAndContained');
const {ScopesManager} = require('../security/scopesManager');
const {ScopesValidator} = require('../security/scopesValidator');
const BundleEntry = require('../../fhir/classes/4_0_0/backbone_elements/bundleEntry');
const {ConfigManager} = require('../../utils/configManager');
const {BundleManager} = require('../common/bundleManager');
const {ResourceLocatorFactory} = require('../common/resourceLocatorFactory');
const {RethrownError} = require('../../utils/rethrownError');
const {SearchManager} = require('../search/searchManager');
const Bundle = require('../../fhir/classes/4_0_0/resources/bundle');
const BundleRequest = require('../../fhir/classes/4_0_0/backbone_elements/bundleRequest');
const {EnrichmentManager} = require('../../enrich/enrich');
const {R4ArgsParser} = require('../query/r4ArgsParser');
const {ParsedArgs} = require('../query/parsedArgs');
const {VERSIONS} = require('../../middleware/fhir/utils/constants');
const {ReferenceParser} = require('../../utils/referenceParser');
const {QueryItem} = require('./queryItem');
const {ProcessMultipleIdsAsyncResult} = require('./processMultipleIdsAsyncResult');
const {FhirResourceCreator} = require('../../fhir/fhirResourceCreator');
const GraphDefinition = require('../../fhir/classes/4_0_0/resources/graphDefinition');
const ResourceContainer = require('../../fhir/classes/4_0_0/simple_types/resourceContainer');
const { logError } = require('../common/logging');
const {sliceIntoChunks} = require('../../utils/list.util');
const {ResourceIdentifier} = require('../../fhir/resourceIdentifier');
const {DatabaseAttachmentManager} = require('../../dataLayer/databaseAttachmentManager');
const {RETRIEVE} = require('../../constants').GRIDFS;


/**
 * This class helps with creating graph responses
 */
class GraphHelper {
    /**
     * @param {DatabaseQueryFactory} databaseQueryFactory
     * @param {SecurityTagManager} securityTagManager
     * @param {ScopesManager} scopesManager
     * @param {ScopesValidator} scopesValidator
     * @param {ConfigManager} configManager
     * @param {BundleManager} bundleManager
     * @param {ResourceLocatorFactory} resourceLocatorFactory
     * @param {R4SearchQueryCreator} r4SearchQueryCreator
     * @param {SearchManager} searchManager
     * @param {EnrichmentManager} enrichmentManager
     * @param {R4ArgsParser} r4ArgsParser
     * @param {DatabaseAttachmentManager} databaseAttachmentManager
     */
    constructor({
                    databaseQueryFactory,
                    securityTagManager,
                    scopesManager,
                    scopesValidator,
                    configManager,
                    bundleManager,
                    resourceLocatorFactory,
                    r4SearchQueryCreator,
                    searchManager,
                    enrichmentManager,
                    r4ArgsParser,
                    databaseAttachmentManager
                }) {
        /**
         * @type {DatabaseQueryFactory}
         */
        this.databaseQueryFactory = databaseQueryFactory;
        assertTypeEquals(databaseQueryFactory, DatabaseQueryFactory);
        /**
         * @type {SecurityTagManager}
         */
        this.securityTagManager = securityTagManager;
        assertTypeEquals(securityTagManager, SecurityTagManager);

        /**
         * @type {ScopesManager}
         */
        this.scopesManager = scopesManager;
        assertTypeEquals(scopesManager, ScopesManager);
        /**
         * @type {ScopesValidator}
         */
        this.scopesValidator = scopesValidator;
        assertTypeEquals(scopesValidator, ScopesValidator);

        /**
         * @type {ConfigManager}
         */
        this.configManager = configManager;
        assertTypeEquals(configManager, ConfigManager);

        /**
         * @type {BundleManager}
         */
        this.bundleManager = bundleManager;
        assertTypeEquals(bundleManager, BundleManager);

        /**
         * @type {ResourceLocatorFactory}
         */
        this.resourceLocatorFactory = resourceLocatorFactory;
        assertTypeEquals(resourceLocatorFactory, ResourceLocatorFactory);

        /**
         * @type {R4SearchQueryCreator}
         */
        this.r4SearchQueryCreator = r4SearchQueryCreator;
        assertTypeEquals(r4SearchQueryCreator, R4SearchQueryCreator);
        /**
         * @type {SearchManager}
         */
        this.searchManager = searchManager;
        assertTypeEquals(searchManager, SearchManager);

        /**
         * @type {EnrichmentManager}
         */
        this.enrichmentManager = enrichmentManager;
        assertTypeEquals(enrichmentManager, EnrichmentManager);

        /**
         * @type {R4ArgsParser}
         */
        this.r4ArgsParser = r4ArgsParser;
        assertTypeEquals(r4ArgsParser, R4ArgsParser);

        /**
         * @type {DatabaseAttachmentManager}
         */
        this.databaseAttachmentManager = databaseAttachmentManager;
        assertTypeEquals(databaseAttachmentManager, DatabaseAttachmentManager);
    }

    /**
     * returns property values
     * @param {EntityAndContainedBase} entity
     * @param {string} property Property to read
     * @param {string?} filterProperty Filter property (optional)
     * @param {string?} filterValue Filter value (optional)
     * @returns {Object[]}
     */
    getPropertiesForEntity({entity, property, filterProperty, filterValue}) {
        const item = (entity instanceof ResourceEntityAndContained) ? entity.resource : entity.item;
        if (property.includes('.')) { // this is a nested property so recurse down and find the value
            /**
             * @type {string[]}
             */
            const propertyComponents = property.split('.');
            /**
             * @type {Object[]}
             */
            let currentElements = [item];
            for (const propertyComponent of propertyComponents) {
                // find nested elements where the property is present and select the property
                currentElements = currentElements.filter(c => c[`${propertyComponent}`]).flatMap(c => c[`${propertyComponent}`]);
                if (currentElements.length === 0) {
                    return [];
                }
            }
            // if there is a filter then check that the last element has that value
            if (filterProperty) {
                currentElements = currentElements.filter(c => c[`${filterProperty}`] && c[`${filterProperty}`] === filterValue);
            }
            return currentElements;
        } else {
            return [item[`${property}`]];
        }
    }

    /**
     * retrieves references from the provided property.
     * Always returns an array of references whether the property value is an array or just an object
     * @param {Object || Object[]} propertyValue
     * @return {string[]}
     */
    getReferencesFromPropertyValue({propertyValue}) {
        if (this.configManager.supportLegacyIds) {
            // concat uuids and ids so we can search both in case some reference does not have
            // _sourceAssigningAuthority set correctly
            return Array.isArray(propertyValue) ?
                propertyValue.map(a => a._uuid).concat(propertyValue.map(a => a.reference)) :
                [].concat([propertyValue._uuid]).concat([propertyValue.reference]);
        } else {
            return Array.isArray(propertyValue) ?
                propertyValue.map(a => a._uuid) :
                [].concat([propertyValue._uuid]);
        }
    }

    /**
     * returns whether this property is a reference (by checking if it has a reference sub property)
     * @param {EntityAndContainedBase[]} entities
     * @param {string} property
     * @param {string?} filterProperty
     * @param {string?} filterValue
     * @returns {boolean}
     */
    isPropertyAReference({entities, property, filterProperty, filterValue}) {
        /**
         * @type {EntityAndContainedBase}
         */
        for (const entity of entities) {
            /**
             * @type {*[]}
             */
            const propertiesForEntity = this.getPropertiesForEntity({
                entity, property, filterProperty, filterValue
            });
            const references = propertiesForEntity
                .flatMap(r => this.getReferencesFromPropertyValue({propertyValue: r}))
                .filter(r => r !== undefined && r !== null);

            if (references && references.length > 0) { // if it has a 'reference' property then it is a reference
                return true; // we assume that if one entity has it then all entities can since they are of same type
            }
        }
        return false;
    }

    /**
     * Gets related resources and adds them to containedEntries in parentEntities
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string} resourceType
     * @param {EntityAndContainedBase[]} parentEntities
     * @param {string} property
     * @param {string | null} filterProperty (Optional) filter the sublist by this property
     * @param {*|null} filterValue (Optional) match filterProperty to this value
     * @param {boolean} [explain]
     * @param {boolean} [debug]
     * @returns {QueryItem}
     */
    async getForwardReferencesAsync({
                                        requestInfo,
                                        base_version,
                                        resourceType,
                                        parentEntities,
                                        property,
                                        filterProperty,
                                        filterValue,
                                        explain,
                                        debug
                                    }) {
        try {
            if (!parentEntities || parentEntities.length === 0) {
                return; // nothing to do
            }

            // get values of this property from all the entities
            const relatedReferences = parentEntities.flatMap(p => this.getPropertiesForEntity({entity: p, property})
                .flatMap(r => this.getReferencesFromPropertyValue({propertyValue: r}))
                .filter(r => r !== undefined && r !== null));
            // select just the ids from those reference properties
            // noinspection JSCheckFunctionSignatures
            let relatedReferenceIds = relatedReferences.map(reference => {
                const {
                    id: referenceId,
                    resourceType: referenceResourceType,
                    sourceAssigningAuthority: referenceSourceAssigningAuthority
                } = ReferenceParser.parseReference(reference);
                // if sourceAssigningAuthority is present in reference (e.g., 'Patient/123|medstar')
                // then the uuid will be correct so no need to include.
                // otherwise (e.g., 'Patient/123' include reference id too to handle where the reference id
                // was not specified with sourceAssigningAuthority.
                return referenceResourceType === resourceType && !referenceSourceAssigningAuthority ?
                    referenceId : null;
            }).filter(i => i !== null);
            if (relatedReferenceIds.length === 0) {
                return; // nothing to do
            }
            // remove duplicates to speed up data access
            relatedReferenceIds = Array.from(new Set(relatedReferenceIds));
            const options = {};
            const projection = {};
            // also exclude _id so if there is a covering index the query can be satisfied from the covering index
            projection['_id'] = 0;
            options['projection'] = projection;
            /**
             * @type {boolean}
             */
            const useAccessIndex = this.configManager.useAccessIndex;

            const args = Object.assign({'base_version': base_version}, {'id': relatedReferenceIds.join(',')});
            const childParseArgs = this.r4ArgsParser.parseArgs(
                {
                    resourceType,
                    args
                }
            );
            let {
                /** @type {import('mongodb').Document}**/
                query, // /** @type {Set} **/
                // columns
            } = await this.searchManager.constructQueryAsync({
                user: requestInfo.user,
                scope: requestInfo.scope,
                isUser: requestInfo.isUser,
                patientIdsFromJwtToken: requestInfo.patientIdsFromJwtToken,
                resourceType,
                useAccessIndex,
                personIdFromJwtToken: requestInfo.personIdFromJwtToken,
                parsedArgs: childParseArgs
            });

            if (filterProperty) {
                query[`${filterProperty}`] = filterValue;
            }
            /**
             * @type {number}
             */
            const maxMongoTimeMS = env.MONGO_TIMEOUT ? parseInt(env.MONGO_TIMEOUT) : (30 * 1000);
            const databaseQueryManager = this.databaseQueryFactory.createQuery({resourceType, base_version});
            /**
             * mongo db cursor
             * @type {DatabasePartitionedCursor}
             */
            let cursor = await databaseQueryManager.findAsync({query, options});

            /**
             * @type {import('mongodb').Document[]}
             */
            const explanations = (explain || debug) ? await cursor.explainAsync() : [];
            if (explain) {
                // if explain is requested then don't return any results
                cursor = cursor.limit(1);
            }

            cursor = cursor.maxTimeMS({milliSecs: maxMongoTimeMS});
            const collectionName = cursor.getFirstCollection();

            while (await cursor.hasNext()) {
                /**
                 * @type {Resource|null}
                 */
                let relatedResource = await cursor.next();

                if (relatedResource) {
                    // create a class to hold information about this resource
                    /**
                     * @type {ResourceEntityAndContained}
                     */
                    relatedResource = await this.databaseAttachmentManager.transformAttachments(
                        relatedResource, RETRIEVE
                    );
                    const relatedEntityAndContained = new ResourceEntityAndContained({
                        entityId: relatedResource.id,
                        entityUuid: relatedResource._uuid,
                        entityResourceType: relatedResource.resourceType,
                        includeInOutput: true,
                        resource: relatedResource,
                        containedEntries: []
                    });

                    // find matching parent and add to containedEntries
                    /**
                     * @type {string}
                     */
                    let idToSearch = `${relatedResource.resourceType}/${relatedResource._uuid}`;
                    /**
                     * @type {EntityAndContainedBase[]}
                     */
                    let matchingParentEntities = parentEntities.filter(
                        p =>
                            this.getPropertiesForEntity({
                                    entity: p,
                                    property
                                }
                            )
                                .flatMap(r => this.getReferencesFromPropertyValue({propertyValue: r}))
                                .filter(r => r !== undefined && r !== null)
                                .includes(idToSearch));

                    if (this.configManager.supportLegacyIds && matchingParentEntities.length === 0) {
                        idToSearch = `${relatedResource.resourceType}/${relatedResource.id}`;
                        matchingParentEntities = parentEntities.filter(
                            p =>
                                this.getPropertiesForEntity({
                                        entity: p,
                                        property
                                    }
                                )
                                    .flatMap(r => this.getReferencesFromPropertyValue({propertyValue: r}))
                                    .filter(r => r !== undefined && r !== null)
                                    .includes(idToSearch));
                    }
                    if (matchingParentEntities.length === 0) {
                        /**
                         * @type {string}
                         */
                        const parentEntitiesString = parentEntities.map(p => `${p.resource.resourceType}/${p.resource._uuid}`).toString();
                        logError('Forward Reference: No match found for child entity ' +
                            `${relatedResource.resourceType}/${relatedResource._uuid} in parent entities ` +
                            `${parentEntitiesString} using property ${property}`, {});
                    }

                    // add it to each one since there can be multiple resources that point to the same related resource
                    for (const /** @type {EntityAndContainedBase} */ matchingParentEntity of matchingParentEntities) {
                        matchingParentEntity.containedEntries = matchingParentEntity.containedEntries.concat(relatedEntityAndContained);
                    }
                }
            }
            return new QueryItem(
                {
                    query,
                    resourceType,
                    collectionName: collectionName,
                    property,
                    explanations
                }
            );
        } catch (e) {
            logError(`Error in getForwardReferencesAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: `Error in getForwardReferencesAsync(): ${resourceType}, ` +
                    `parents:${parentEntities.map(p => p.entityId)}, property=${property}`,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    resourceType,
                    parentEntities,
                    property,
                    filterProperty,
                    filterValue,
                    explain,
                    debug
                }
            });
        }
    }

    /**
     * converts a query string into an args array
     * @param {string} resourceType
     * @param {string} queryString
     * @return {ParsedArgs}
     */
    parseQueryStringIntoArgs({resourceType, queryString}) {
        const args = Object.fromEntries(new URLSearchParams(queryString));
        args['base_version'] = VERSIONS['4_0_0'];
        return this.r4ArgsParser.parseArgs(
            {
                resourceType,
                args: args
            }
        );
    }

    /**
     * Gets related resources using reverse link and add them to containedEntries in parentEntities
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string} parentResourceType
     * @param {string} relatedResourceType
     * @param {EntityAndContainedBase[]}  parentEntities parent entities
     * @param {string | null} filterProperty (Optional) filter the sublist by this property
     * @param {*} filterValue (Optional) match filterProperty to this value
     * @param {string} reverse_filter Do a reverse link from child to parent using this property
     * @param {boolean} [explain]
     * @param {boolean} [debug]
     * @returns {QueryItem}
     */
    async getReverseReferencesAsync({
                                        requestInfo,
                                        base_version,
                                        parentResourceType,
                                        relatedResourceType,
                                        parentEntities,
                                        filterProperty,
                                        filterValue,
                                        reverse_filter,
                                        explain,
                                        debug
                                    }) {
        try {
            if (!(reverse_filter)) {
                throw new Error('reverse_filter must be set');
            }
            // create comma separated list of ids
            /**
             * @type {string[]}
             */
            let parentResourceTypeAndIdList = parentEntities
                .filter(p => p.entityUuid !== undefined && p.entityUuid !== null)
                .map(p => `${p.resource.resourceType}/${p.entityUuid}`);
            if (this.configManager.supportLegacyIds) {
                parentResourceTypeAndIdList = parentResourceTypeAndIdList.concat(
                    parentEntities
                        .filter(p => p.entityId !== undefined && p.entityId !== null)
                        .map(p => `${p.resource.resourceType}/${p.entityId}`)
                );
            }

            if (parentResourceTypeAndIdList.length === 0) {
                return;
            }
            /**
             * @type {string}
             */
            const reverseFilterWithParentIds = reverse_filter.replace('{ref}', parentResourceTypeAndIdList.join(','));
            /**
             * @type {ParsedArgs}
             */
            const relatedResourceParsedArgs = this.parseQueryStringIntoArgs(
                {
                    resourceType: relatedResourceType,
                    queryString: reverseFilterWithParentIds
                }
            );
            const args = {};
            args['base_version'] = base_version;
            const searchParameterName = reverse_filter.split('=')[0];
            /**
             * @type {boolean}
             */
            const useAccessIndex = this.configManager.useAccessIndex;

            /**
             * @type {{base_version, columns: Set, query: import('mongodb').Document}}
             */
            let {
                /** @type {import('mongodb').Document}**/
                query, // /** @type {Set} **/
                // columns
            } = await this.searchManager.constructQueryAsync(
                {
                    user: requestInfo.user,
                    scope: requestInfo.scope,
                    isUser: requestInfo.isUser,
                    patientIdsFromJwtToken: requestInfo.patientIdsFromJwtToken,
                    resourceType: relatedResourceType,
                    useAccessIndex,
                    personIdFromJwtToken: requestInfo.personIdFromJwtToken,
                    parsedArgs: relatedResourceParsedArgs
                }
            );

            const options = {};
            const projection = {};
            // also exclude _id so if there is a covering index the query can be satisfied from the covering index
            projection['_id'] = 0;
            options['projection'] = projection;

            /**
             * @type {number}
             */
            const maxMongoTimeMS = env.MONGO_TIMEOUT ? parseInt(env.MONGO_TIMEOUT) : (30 * 1000);
            const databaseQueryManager = this.databaseQueryFactory.createQuery({
                resourceType: relatedResourceType,
                base_version
            });
            /**
             * mongo db cursor
             * @type {DatabasePartitionedCursor}
             */
            let cursor = await databaseQueryManager.findAsync({query, options});
            cursor = cursor.maxTimeMS({milliSecs: maxMongoTimeMS});

            // find matching field name in searchParameter list.  We will use this to match up to parent
            /**
             * @type {string}
             */
            const fieldForSearchParameter = getFieldNameForSearchParameter(relatedResourceType, searchParameterName);

            if (!fieldForSearchParameter) {
                throw new Error(`${searchParameterName} is not a valid search parameter for resource ${relatedResourceType}`);
            }

            /**
             * @type {import('mongodb').Document[]}
             */
            const explanations = (explain || debug) ? await cursor.explainAsync() : [];
            if (explain) {
                // if explain is requested then don't return any results
                cursor = cursor.limit(1);
            }
            const collectionName = cursor.getFirstCollection();

            while (await cursor.hasNext()) {
                /**
                 * @type {Resource|null}
                 */
                let relatedResourcePropertyCurrent = await cursor.next();
                if (relatedResourcePropertyCurrent) {
                    relatedResourcePropertyCurrent = await this.databaseAttachmentManager.transformAttachments(
                        relatedResourcePropertyCurrent, RETRIEVE
                    );
                    if (filterProperty !== null) {
                        if (relatedResourcePropertyCurrent[`${filterProperty}`] !== filterValue) {
                            continue;
                        }
                    }
                    // create the entry
                    const resourceEntityAndContained = new ResourceEntityAndContained({
                        entityId: relatedResourcePropertyCurrent.id,
                        entityUuid: relatedResourcePropertyCurrent._uuid,
                        entityResourceType: relatedResourcePropertyCurrent.resourceType,
                        includeInOutput: true,
                        resource: relatedResourcePropertyCurrent,
                        containedEntries: []
                    });
                    // now match to parent entity, so we can put under correct contained property
                    const properties = this.getPropertiesForEntity({
                        entity: resourceEntityAndContained, property: fieldForSearchParameter
                    });
                    // the reference property can be a single item or an array. Remove the sourceAssigningAuthority
                    // from references before matching.
                    /**
                     * @type {string[]}
                     */
                    const references = properties
                        .flatMap(r => this.getReferencesFromPropertyValue({propertyValue: r}))
                        .filter(r => r !== undefined).map(r => r.split('|')[0]);
                    /**
                     * @type {EntityAndContainedBase[]}
                     */
                    let matchingParentEntities = parentEntities.filter(
                        p => references.includes(`${p.resource.resourceType}/${p.resource._uuid}`));

                    if (this.configManager.supportLegacyIds && matchingParentEntities.length === 0) {
                        matchingParentEntities = parentEntities.filter(
                            p => references.includes(`${p.resource.resourceType}/${p.resource.id}`));
                    }
                    if (matchingParentEntities.length === 0) {
                        const parentEntitiesString = parentEntities.map(
                            p => `${p.resource.resourceType}/${p.resource.id}`).toString();
                        logError(
                            `Reverse Reference: No match found for parent entities ${parentEntitiesString} ` +
                            `using property ${fieldForSearchParameter} in ` +
                            'child entity ' +
                            `${relatedResourcePropertyCurrent.resourceType}/${relatedResourcePropertyCurrent.id}`, {}
                        );
                    }

                    for (const matchingParentEntity of matchingParentEntities) {
                        matchingParentEntity.containedEntries.push(resourceEntityAndContained);
                    }
                }
            }
            return new QueryItem({
                    query,
                    resourceType: relatedResourceType,
                    collectionName: collectionName,
                    reverse_filter,
                    explanations
                }
            );
        } catch (e) {
            logError(`Error in getReverseReferencesAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in getReverseReferencesAsync(): ' +
                    `parentResourceType: ${parentResourceType} relatedResourceType:${relatedResourceType}, ` +
                    `parents:${parentEntities.map(p => p.entityId)}, ` +
                    `filterProperty=${filterProperty}, filterValue=${filterValue}, ` +
                    `reverseFilter=${reverse_filter}`,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    parentResourceType,
                    relatedResourceType,
                    parentEntities,
                    filterProperty,
                    filterValue,
                    reverse_filter,
                    explain,
                    debug
                }
            });
        }
    }

    /**
     * returns whether the resource has the passed in property (handles nested properties)
     * @param {EntityAndContainedBase} entity
     * @param {string} property
     * @param {string} filterProperty
     * @param {string} filterValue
     * @returns {boolean}
     */
    doesEntityHaveProperty({entity, property, filterProperty, filterValue}) {
        const item = (entity instanceof ResourceEntityAndContained) ? entity.resource : entity.item;
        if (property.includes('.')) {
            /**
             * @type {string[]}
             */
            const propertyComponents = property.split('.');
            /**
             * @type {*[]}
             */
            let currentElements = [item];
            /**
             * @type {string}
             */
            for (const propertyComponent of propertyComponents) {
                // find nested elements where the property is present and select the property
                currentElements = currentElements.filter(c => c[`${propertyComponent}`]).flatMap(c => c[`${propertyComponent}`]);
                if (currentElements.length === 0) {
                    return false;
                }
            }
            // if there is a filter then check that the last element has that value
            if (filterProperty) {
                currentElements = currentElements.filter(c => c[`${filterProperty}`] && c[`${filterProperty}`] === filterValue);
                return (currentElements.length > 0);
            } else { // if not filter then just return true if we find the field
                return true;
            }
        } else {
            return item[`${property}`];
        }
    }

    /**
     * Parses the filter out of the property name
     * @param {string} property
     * @returns {{filterValue: string, filterProperty: string, property: string}}
     */
    getFilterFromPropertyPath(property) {
        /**
         * @type {string}
         */
        let filterProperty;
        /**
         * @type {string}
         */
        let filterValue;
        // if path is more complex and includes filter
        if (property.includes(':')) {
            /**
             * @type {string[]}
             */
            const property_split = property.split(':');
            if (property_split && property_split.length > 0) {
                /**
                 * @type {string}
                 */
                property = property_split[0];
                /**
                 * @type {string[]}
                 */
                const filterPropertySplit = property_split[1].split('=');
                if (filterPropertySplit.length > 1) {
                    /**
                     * @type {string}
                     */
                    filterProperty = filterPropertySplit[0];
                    /**
                     * @type {string}
                     */
                    filterValue = filterPropertySplit[1];
                }
            }
        }
        return {filterProperty, filterValue, property};
    }

    /**
     * process a link
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string|null} parentResourceType
     * @param {{path: string, params: string, target: {type: string}[]}} link
     * @param {EntityAndContainedBase[]} parentEntities
     * @param {boolean|null} explain
     * @param {boolean|null} debug
     * @param {{type: string}} target
     * @param {ParsedArgs} parsedArgs
     * @return {Promise<{queryItems: QueryItem[], childEntries: EntityAndContainedBase[]}>}
     */
    async processLinkTargetAsync(
        {
            requestInfo,
            base_version,
            parentResourceType,
            link,
            parentEntities,
            explain,
            debug,
            target,
            parsedArgs
        }
    ) {
        try {
            /**
             * @type {QueryItem[]}
             */
            let queryItems = [];
            /**
             * @type {EntityAndContainedBase[]}
             */
            let childEntries = [];
            /**
             * If this is not set then the caller does not want this entity but a nested entity
             * defined further in the GraphDefinition
             * @type {string | null}
             */
            const resourceType = target.type;
            // there are two types of linkages:
            // 1. forward linkage: a property in the current object is a reference to the target object (uses "path")
            // 2. reverse linkage: a property in the target object is a reference to the current object (uses "params")
            if (link.path) { // forward link
                /**
                 * @type {string}
                 */
                const originalProperty = link.path.replace('[x]', '');
                const {filterProperty, filterValue, property} = this.getFilterFromPropertyPath(originalProperty);
                // find parent entities that have a valid property
                parentEntities = parentEntities.filter(p => this.doesEntityHaveProperty({
                    entity: p, property, filterProperty, filterValue
                }));
                // if this is a reference then get related resources
                if (this.isPropertyAReference({
                    entities: parentEntities, property, filterProperty, filterValue
                })) {
                    await this.scopesValidator.verifyHasValidScopesAsync({
                        requestInfo,
                        parsedArgs,
                        resourceType,
                        startTime: Date.now(),
                        action: 'graph',
                        accessRequested: 'read'
                    });
                    /**
                     * @type {QueryItem}
                     */
                    const queryItem = await this.getForwardReferencesAsync(
                        {
                            requestInfo,
                            base_version,
                            resourceType,
                            parentEntities,
                            property,
                            filterProperty,
                            filterValue,
                            explain,
                            debug,
                        }
                    );
                    if (queryItem) {
                        queryItems.push(queryItem);
                    }
                    childEntries = parentEntities.flatMap(p => p.containedEntries);
                } else { // handle paths that are not references
                    childEntries = [];
                    for (const parentEntity of parentEntities) {
                        // create child entries
                        /**
                         * @type {Object[]}
                         */
                        const children = this.getPropertiesForEntity({
                            entity: parentEntity, property, filterProperty, filterValue
                        });
                        /**
                         * @type {NonResourceEntityAndContained[]}
                         */
                        const childEntriesForCurrentEntity = children.map(c => new NonResourceEntityAndContained({
                            includeInOutput: target.type !== undefined, // if caller has requested this entity or just wants a nested entity
                            item: c, containedEntries: []
                        }));
                        childEntries = childEntries.concat(childEntriesForCurrentEntity);
                        parentEntity.containedEntries = parentEntity.containedEntries.concat(childEntriesForCurrentEntity);
                    }
                }
            } else if (target.params) { // reverse link
                if (target.type) { // if caller has requested this entity or just wants a nested entity
                    // reverse link
                    await this.scopesValidator.verifyHasValidScopesAsync({
                        requestInfo,
                        parsedArgs,
                        resourceType,
                        startTime: Date.now(),
                        action: 'graph',
                        accessRequested: 'read'
                    });
                    if (!parentResourceType) {
                        const parentEntitiesString = parentEntities.map(p => `${p.resource.resourceType}/${p.resource._uuid}`).toString();
                        logError(
                            'processOneGraphLinkAsync: No parent resource found for reverse references for ' +
                            `parent entities: ${parentEntitiesString} using target.params: ${target.params}`, {}
                        );
                    }
                    const queryItem = await this.getReverseReferencesAsync(
                        {
                            requestInfo,
                            base_version,
                            parentResourceType,
                            relatedResourceType: resourceType,
                            parentEntities,
                            filterProperty: null,
                            filterValue: null,
                            reverse_filter: target.params,
                            explain,
                            debug
                        }
                    );
                    if (queryItem) {
                        queryItems.push(queryItem);
                    }
                    childEntries = parentEntities.flatMap(p => p.containedEntries);
                }
            }

            // filter childEntries to find entries of same type as parentResource
            childEntries = childEntries.filter(c => (!target.type && !c.resource) || // either there is no target type so choose non-resources
                (target.type && c.resource && c.resource.resourceType === target.type) // or there is a target type so match to it
            );
            if (childEntries && childEntries.length > 0) {
                /**
                 * @type {string|null}
                 */
                const childResourceType = target.type;

                // Now recurse down and process the link
                /**
                 * @type {[{path:string, params: string,target:[{type: string}]}]}
                 */
                const childLinks = target.link;
                if (childLinks) {
                    // now recurse and process the next link in GraphDefinition
                    /**
                     * @type {QueryItem[]}
                     */
                    const recursiveQueries = await async.flatMap(
                        childLinks,
                        async childLink => await this.processOneGraphLinkAsync(
                            {
                                requestInfo,
                                base_version,
                                parentResourceType: childResourceType,
                                link: childLink,
                                parentEntities: childEntries,
                                explain,
                                debug,
                                parsedArgs
                            }
                        )
                    );
                    queryItems = queryItems.concat(recursiveQueries);
                }
            }
            return {queryItems, childEntries};
        } catch (e) {
            logError(`Error in processLinkTargetAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in processLinkTargetAsync(): ' + `parentResourceType: ${parentResourceType}, `,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    parentResourceType,
                    link,
                    parentEntities,
                    explain,
                    debug,
                    target
                }
            });
        }
    }

    /**
     * processes a single graph link
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string | null} parentResourceType
     * @param {{path: string, params: string, target: {type: string}[]}} link
     * @param {EntityAndContainedBase[]} parentEntities
     * @param {boolean} [explain]
     * @param {boolean} [debug]
     * @param {ParsedArgs} parsedArgs
     * @returns {QueryItem[]}
     */
    async processOneGraphLinkAsync(
        {
            requestInfo,
            base_version,
            parentResourceType,
            link,
            parentEntities,
            explain,
            debug,
            parsedArgs
        }
    ) {
        try {
            /**
             * @type {{type: string}[]}
             */
            let link_targets = link.target;
            /**
             * @type {{queryItems: QueryItem[], childEntries: EntityAndContainedBase[]}[]}
             */
            const result = await async.map(
                link_targets,
                async (/** @type {type: string} */ target) => await this.processLinkTargetAsync(
                    {
                        requestInfo,
                        base_version,
                        parentResourceType,
                        link,
                        parentEntities,
                        explain,
                        debug,
                        target,
                        parsedArgs
                    }
                )
            );
            /**
             * @type {QueryItem[]}
             */
            const queryItems = result.flatMap(r => r.queryItems);
            return queryItems;
        } catch (e) {
            logError(`Error in processOneGraphLinkAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in processOneGraphLinkAsync(): ' +
                    `parentResourceType: ${parentResourceType} , ` +
                    `parents:${parentEntities.map(p => p.entityId)}, `,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    parentResourceType,
                    link,
                    parentEntities,
                    explain,
                    debug
                }
            });
        }
    }

    /**
     * processes a list of graph links
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string} parentResourceType
     * @param {Resource[]} parentResources
     * @param {{path:string, params: string,target:{type: string}[]}[]} linkItems
     * @param {boolean} [explain]
     * @param {boolean} [debug]
     * @param {ParsedArgs} parsedArgs
     * @return {Promise<{entities: ResourceEntityAndContained[], queryItems: QueryItem[]}>}
     */
    async processGraphLinksAsync(
        {
            requestInfo,
            base_version,
            parentResourceType,
            parentResources,
            linkItems,
            explain,
            debug,
            parsedArgs
        }
    ) {
        try {
            /**
             * @type {ResourceEntityAndContained[]}
             */
            const resultEntities = parentResources.map(parentResource => new ResourceEntityAndContained({
                entityId: parentResource.id,
                entityUuid: parentResource._uuid,
                entityResourceType: parentResource.resourceType,
                includeInOutput: true,
                resource: parentResource,
                containedEntries: []
            }));
            /**
             * @type {QueryItem[]}
             */
            const queryItems = await async.flatMap(
                linkItems,
                async (link) => await this.processOneGraphLinkAsync(
                    {
                        requestInfo,
                        base_version,
                        parentResourceType,
                        link,
                        parentEntities: resultEntities,
                        explain,
                        debug,
                        parsedArgs
                    }
                )
            );
            return {entities: resultEntities, queryItems};
        } catch (e) {
            logError(`Error in processGraphLinksAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in processGraphLinksAsync(): ' +
                    `parentResourceType: ${parentResourceType} , ` +
                    `parents:${parentResources.map(p => p.id)}, `,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    parentResourceType,
                    parentEntities: parentResources,
                    linkItems,
                    explain,
                    debug
                }
            });
        }
    }

    /**
     * prepends # character in references
     * @param {Resource} parent_entity
     * @param {reference:string[]} linkReferences
     * @return {Promise<Resource>}
     */
    async convertToHashedReferencesAsync({parent_entity, linkReferences}) {
        try {
            /**
             * @type {Set<string>}
             */
            const uniqueReferences = new Set(linkReferences);
            if (parent_entity) {
                /**
                 * @type {string}
                 */
                for (const link_reference of uniqueReferences) {
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    let re = new RegExp('\\b' + escapeRegExp(link_reference) + '\\b', 'g');
                    parent_entity = JSON.parse(parent_entity.toJSONInternal().replace(re, '#'.concat(link_reference)));
                }
            }
            return parent_entity;
        } catch (e) {
            logError(`Error in convertToHashedReferencesAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in convertToHashedReferencesAsync(): ',
                error: e,
                args: {parent_entity, linkReferences}
            });
        }
    }

    /**
     * get all the contained entities recursively
     * @param {EntityAndContainedBase} entityAndContained
     * @returns {BundleEntry[]}
     */
    getRecursiveContainedEntities(entityAndContained) {
        /**
         * @type {BundleEntry[]}
         */
        let result = [];
        if (entityAndContained.includeInOutput) { // only include entities the caller has requested
            result = result.concat(
                [
                    new BundleEntry(
                        {
                            id: entityAndContained.resource.id,
                            fullUrl: entityAndContained.fullUrl,
                            resource: entityAndContained.resource
                        }
                    )
                ]
            );
        }

        // now recurse
        result = result.concat(entityAndContained.containedEntries.flatMap(c => this.getRecursiveContainedEntities(c)));
        return result;
    }

    /**
     * processing multiple ids
     * @param {string} base_version
     * @param {FhirRequestInfo} requestInfo
     * @param {string} resourceType
     * @param {Resource} graphDefinition
     * @param {boolean} contained
     * @param {boolean} [explain]
     * @param {boolean} [debug]
     * @param {ParsedArgs} parsedArgs
     * @param {BaseResponseStreamer|undefined} [responseStreamer]
     * @param {ResourceIdentifier[]} idsAlreadyProcessed
     * @return {Promise<ProcessMultipleIdsAsyncResult>}
     */
    async processMultipleIdsAsync(
        {
            base_version,
            requestInfo,
            resourceType,
            graphDefinition,
            contained,
            explain,
            debug,
            parsedArgs,
            responseStreamer,
            idsAlreadyProcessed
        }
    ) {
        assertTypeEquals(parsedArgs, ParsedArgs);
        try {
            /**
             * @type {BundleEntry[]}
             */
            let entries = [];

            // so any POSTed data is not read as parameters
            parsedArgs.remove('resource');

            let {
                /** @type {import('mongodb').Document}**/
                query
            } = await this.searchManager.constructQueryAsync({
                user: requestInfo.user,
                scope: requestInfo.scope,
                isUser: requestInfo.isUser,
                patientIdsFromJwtToken: requestInfo.patientIdsFromJwtToken,
                resourceType,
                useAccessIndex: this.configManager.useAccessIndex,
                personIdFromJwtToken: requestInfo.personIdFromJwtToken,
                parsedArgs
            });

            /**
             * @type {import('mongodb').FindOptions<import('mongodb').DefaultSchema>}
             */
            const options = {};
            const projection = {};
            // also exclude _id so if there is a covering index the query can be satisfied from the covering index
            projection['_id'] = 0;
            options['projection'] = projection;

            /**
             * @type {number}
             */
            const maxMongoTimeMS = env.MONGO_TIMEOUT ? parseInt(env.MONGO_TIMEOUT) : (30 * 1000);

            /**
             * @type {QueryItem[]}
             */
            const queries = [];
            /**
             * @type {import('mongodb').FindOptions<import('mongodb').DefaultSchema>[]}
             */
            const optionsForQueries = [];

            const databaseQueryManager = this.databaseQueryFactory.createQuery({resourceType, base_version});
            /**
             * mongo db cursor
             * @type {DatabasePartitionedCursor}
             */
            let cursor = await databaseQueryManager.findAsync({query, options});
            cursor = cursor.maxTimeMS({milliSecs: maxMongoTimeMS});

            const collectionName = cursor.getFirstCollection();
            queries.push(
                new QueryItem({
                        query,
                        resourceType,
                        collectionName: collectionName
                    }
                )
            );
            optionsForQueries.push(options);
            /**
             * @type {import('mongodb').Document[]}
             */
            const explanations = explain || debug ? await cursor.explainAsync() : [];
            if (explain) {
                // if explain is requested then just return one result
                cursor = cursor.limit(1);
            }

            /**
             * @type {BundleEntry[]}
             */
            const topLevelBundleEntries = [];

            while (await cursor.hasNext()) {
                /**
                 * element
                 * @type {Resource|null}
                 */
                let startResource = await cursor.next();
                if (startResource) {
                    /**
                     * @type {BundleEntry}
                     */

                    startResource = await this.databaseAttachmentManager.transformAttachments(
                        startResource, RETRIEVE
                    );
                    let current_entity = new BundleEntry({
                        id: startResource.id,
                        resource: startResource
                    });
                    entries = entries.concat([current_entity]);
                    topLevelBundleEntries.push(current_entity);
                }
            }

            /**
             * @type {Resource[]}
             */
            const parentResources = topLevelBundleEntries.map(e => e.resource);

            /**
             * @type {{path:string, params: string,target:{type: string}[]}[]}
             */
            const linkItems = graphDefinition.link;
            /**
             * @type {{entities: ResourceEntityAndContained[], queryItems: QueryItem[]}}
             */
            const {entities: allRelatedEntries, queryItems} = await this.processGraphLinksAsync(
                {
                    requestInfo,
                    base_version,
                    parentResourceType: resourceType,
                    parentResources,
                    linkItems,
                    explain,
                    debug,
                    parsedArgs
                }
            );

            for (const q of queryItems) {
                if (q) {
                    queries.push(q);
                }
                if (q.explanations) {
                    for (const e of q.explanations) {
                        explanations.push(e);
                    }
                }
            }

            /**
             * @type {ResourceIdentifier[]}
             */
            const idsOfBundleEntriesProcessed = idsAlreadyProcessed;
            for (const /** @type {ResourceEntityAndContained} */ entity of allRelatedEntries) {
                /**
                 * @type {Resource}
                 */
                const topLevelResource = entity.resource;
                /**
                 * @type {BundleEntry[]}
                 */
                let bundleEntriesForTopLevelResource = [];
                /**
                 * @type {BundleEntry}
                 */
                const bundleEntry = new BundleEntry({
                    id: topLevelResource.id,
                    resource: topLevelResource
                });
                bundleEntriesForTopLevelResource.push(bundleEntry);
                bundleEntriesForTopLevelResource = await this.enrichmentManager.enrichBundleEntriesAsync(
                    {
                        entries: bundleEntriesForTopLevelResource,
                        parsedArgs
                    }
                );

                if (entity.containedEntries.length > 0) {
                    /**
                     * @type {BundleEntry[]}
                     */
                    const recursiveEntries = entity.containedEntries.flatMap(
                        e => this.getRecursiveContainedEntities(
                            e
                        )
                    );

                    if (contained) {
                        /**
                         * @type {Resource[]}
                         */
                        let containedResources = recursiveEntries.map(e => e.resource);
                        containedResources = await this.enrichmentManager.enrichAsync(
                            {
                                resources: containedResources,
                                parsedArgs
                            }
                        );
                        topLevelResource.contained = containedResources;
                        // enrich again now that we've changed the resource
                        bundleEntriesForTopLevelResource = await this.enrichmentManager.enrichBundleEntriesAsync(
                            {
                                entries: bundleEntriesForTopLevelResource,
                                parsedArgs
                            }
                        );
                    } else {
                        bundleEntriesForTopLevelResource = bundleEntriesForTopLevelResource.concat(recursiveEntries);
                        // enrich again now that we've added new entries to bundle
                        bundleEntriesForTopLevelResource = await this.enrichmentManager.enrichBundleEntriesAsync(
                            {
                                entries: bundleEntriesForTopLevelResource,
                                parsedArgs
                            }
                        );
                    }
                }
                /**
                 * @type {string[]}
                 */
                const accessCodes = this.scopesManager.getAccessCodesFromScopes('read', requestInfo.user, requestInfo.scope);
                bundleEntriesForTopLevelResource = bundleEntriesForTopLevelResource.filter(
                    e => this.scopesManager.doesResourceHaveAnyAccessCodeFromThisList(
                        accessCodes, requestInfo.user, requestInfo.scope, e.resource
                    )
                );

                if (responseStreamer) {
                    for (const bundleEntry1 of bundleEntriesForTopLevelResource) {
                        const resourceIdentifier = new ResourceIdentifier(bundleEntry1.resource);

                        if (!idsOfBundleEntriesProcessed.some(i => i.equals(resourceIdentifier))) {
                            await responseStreamer.writeBundleEntryAsync(
                                {
                                    bundleEntry: bundleEntry1
                                }
                            );
                            idsOfBundleEntriesProcessed.push(resourceIdentifier);
                        }
                    }
                } else {
                    for (const bundleEntry1 of bundleEntriesForTopLevelResource) {
                        const resourceIdentifier = new ResourceIdentifier(bundleEntry1.resource);

                        if (!idsOfBundleEntriesProcessed.some(i => i.equals(resourceIdentifier))) {
                            entries.push(bundleEntry1);
                            idsOfBundleEntriesProcessed.push(resourceIdentifier);
                        }
                    }
                }
            }

            /**
             * @type {ResourceIdentifier[]}
             */
            const bundleEntryIdsProcessed = entries.map(e => new ResourceIdentifier(e.resource));
            if (responseStreamer) {
                entries = [];
            } else {
                entries = this.bundleManager.removeDuplicateEntries({entries});
            }

            return new ProcessMultipleIdsAsyncResult(
                {
                    entries,
                    queryItems: queries,
                    options: optionsForQueries,
                    explanations,
                    bundleEntryIdsProcessed
                }
            );
        } catch (e) {
            logError(`Error in processMultipleIdsAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in processMultipleIdsAsync(): ' + `resourceType: ${resourceType} , `,
                error: e,
                args: {
                    base_version,
                    requestInfo,
                    resourceType,
                    graphDefinition,
                    contained,
                    explain,
                    debug,
                    parsedArgs
                }
            });
        }
    }


    /**
     * process GraphDefinition and returns a bundle with all the related resources
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string} resourceType
     * @param {Object} graphDefinitionJson (a GraphDefinition resource)
     * @param {boolean} contained
     * @param {BaseResponseStreamer|undefined} [responseStreamer]
     * @param {ParsedArgs} parsedArgs
     * @return {Promise<Bundle>}
     */
    async processGraphAsync(
        {
            requestInfo,
            base_version,
            resourceType,
            graphDefinitionJson,
            contained,
            responseStreamer,
            parsedArgs
        }
    ) {
        assertTypeEquals(parsedArgs, ParsedArgs);
        try {
            /**
             * @type {number}
             */
            const startTime = Date.now();
            /**
             * @type {Resource}
             */
            const graphDefinition = FhirResourceCreator.create(graphDefinitionJson, GraphDefinition);
            assertTypeEquals(graphDefinition, GraphDefinition);


            // see if the count of ids is greater than batch size
            /**
             * @type {ParsedArgsItem}
             */
            const idParsedArg = parsedArgs.get('id') || parsedArgs.get('_id');
            /**
             * @type {string[]|null}
             */
            const ids = idParsedArg.queryParameterValue.values;
            /**
             * @type {string[][]}
             */
            const idChunks = ids ? sliceIntoChunks(ids, this.configManager.graphBatchSize) : [];

            /**
             * @type {BundleEntry[]}
             */
            let entries = [];
            /**
             * @type {QueryItem[]}
             */
            let queryItems = [];
            /**
             * @type {import('mongodb').FindOptions<import('mongodb').DefaultSchema>[]}
             */
            let options = [];
            /**
             * @type {import('mongodb').Document[]}
             */
            let explanations = [];

            /**
             * @type {ResourceIdentifier[]}
             */
            let bundleEntryIdsProcessed = [];

            for (const /** @type {string[]} */ idChunk of idChunks) {
                const parsedArgsForChunk = parsedArgs.clone();
                parsedArgsForChunk.id = idChunk;
                /**
                 * @type {ProcessMultipleIdsAsyncResult}
                 */
                const {
                    entries: entries1,
                    queryItems: queryItems1,
                    options: options1,
                    explanations: explanations1,
                    bundleEntryIdsProcessed: bundleEntryIdsProcessed1
                } = await this.processMultipleIdsAsync(
                    {
                        base_version,
                        requestInfo,
                        resourceType,
                        graphDefinition,
                        contained,
                        explain: parsedArgs['_explain'] ? true : false,
                        debug: parsedArgs['_debug'] ? true : false,
                        parsedArgs: parsedArgsForChunk,
                        responseStreamer,
                        idsAlreadyProcessed: bundleEntryIdsProcessed
                    }
                );
                entries = entries.concat(entries1);
                queryItems = queryItems.concat(queryItems1);
                options = options.concat(options1);
                explanations = explanations.concat(explanations1);
                bundleEntryIdsProcessed = bundleEntryIdsProcessed.concat(bundleEntryIdsProcessed1);
            }
            /**
             * @type {number}
             */
            const stopTime = Date.now();

            /**
             * @type {Resource[]}
             */
            const resources = entries.map(bundleEntry => bundleEntry.resource);

            /**
             * @type {Bundle}
             */
            const bundle = this.bundleManager.createBundle(
                {
                    type: 'searchset',
                    requestId: requestInfo.requestId,
                    originalUrl: requestInfo.originalUrl,
                    host: requestInfo.host,
                    protocol: requestInfo.protocol,
                    resources,
                    base_version,
                    parsedArgs,
                    originalQuery: queryItems,
                    originalOptions: options,
                    columns: new Set(),
                    stopTime,
                    startTime,
                    user: requestInfo.user,
                    explanations
                }
            );
            if (responseStreamer) {
                responseStreamer.setBundle({bundle});
            }
            return bundle;
        } catch (e) {
            logError(`Error in processGraphAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in processGraphAsync(): ' + `resourceType: ${resourceType} , ` + e.message,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    resourceType,
                    graphDefinitionJson,
                    contained,
                    parsedArgs,
                    responseStreamer
                }
            });
        }
    }

    /**
     * process GraphDefinition and returns a bundle with all the related resources
     * @param {FhirRequestInfo} requestInfo
     * @param {string} base_version
     * @param {string} resourceType
     * @param {Object} graphDefinitionJson (a GraphDefinition resource)
     * @param {BaseResponseStreamer} responseStreamer
     * @param {ParsedArgs} parsedArgs
     * @return {Promise<Bundle>}
     */
    async deleteGraphAsync(
        {
            requestInfo,
            base_version,
            resourceType,
            graphDefinitionJson,
            responseStreamer,
            parsedArgs
        }
    ) {
        try {
            /**
             * @type {number}
             */
            const startTime = Date.now();
            /**
             * @type {Bundle}
             */
            const bundle = await this.processGraphAsync(
                {
                    requestInfo,
                    base_version,
                    resourceType,
                    contained: false,
                    graphDefinitionJson,
                    responseStreamer: null, // don't let graph send the response
                    parsedArgs
                }
            );
            // now iterate and delete by resuourceType and Id
            /**
             * @type {BundleEntry[]}
             */
            const deleteOperationBundleEntries = [];
            for (const entry of bundle.entry) {
                /**
                 * @type {Resource}
                 */
                const resource = entry.resource;
                /**
                 * @type {string}
                 */
                const resultResourceType = resource.resourceType;
                /**
                 * @type {string[]}
                 */
                const idList = [resource._uuid];
                /**
                 * @type {DatabaseQueryManager}
                 */
                const databaseQueryManager = this.databaseQueryFactory.createQuery({
                    resourceType: resultResourceType,
                    base_version
                });
                await this.scopesValidator.verifyHasValidScopesAsync({
                    requestInfo,
                    parsedArgs,
                    resourceType: resultResourceType,
                    action: 'graph',
                    accessRequested: 'write',
                    startTime
                });

                await databaseQueryManager.deleteManyAsync({
                    requestId: requestInfo.requestId,
                    query: {_uuid: {$in: idList}}
                });

                // for testing with delay
                // await new Promise(r => setTimeout(r, 10000));

                const bundleEntry = new BundleEntry({
                    id: resource.id,
                    resource: FhirResourceCreator.create({
                        id: resource.id,
                        resourceType: resultResourceType
                    }, ResourceContainer),
                    request: new BundleRequest(
                        {
                            id: requestInfo.requestId,
                            method: 'DELETE',
                            url: `/${base_version}/${resultResourceType}/${resource.id}`
                        }
                    )
                });
                deleteOperationBundleEntries.push(bundleEntry);
                if (responseStreamer) {
                    await responseStreamer.writeBundleEntryAsync({bundleEntry});
                }
            }
            const deleteOperationBundle = new Bundle({
                id: requestInfo.requestId,
                type: 'batch-response',
                entry: deleteOperationBundleEntries,
                total: deleteOperationBundleEntries.length
            });
            if (responseStreamer) {
                await responseStreamer.setBundle({bundle: deleteOperationBundle});
            }
            return deleteOperationBundle;
        } catch (e) {
            logError(`Error in deleteGraphAsync(): ${e.message}`, {error: e});
            throw new RethrownError({
                message: 'Error in deleteGraphAsync(): ' + `resourceType: ${resourceType} , ` + e.message,
                error: e,
                args: {
                    requestInfo,
                    base_version,
                    resourceType,
                    graphDefinitionJson,
                    parsedArgs,
                    responseStreamer
                }
            });
        }
    }
}

module.exports = {
    GraphHelper
};
