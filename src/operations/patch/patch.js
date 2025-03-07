// noinspection ExceptionCaughtLocallyJS

const {BadRequestError, NotFoundError} = require('../../utils/httpErrors');
const {validate, applyPatch, compare} = require('fast-json-patch');
const moment = require('moment-timezone');
const { FieldMapper } = require('../query/filters/fieldMapper');
const {assertTypeEquals, assertIsValid} = require('../../utils/assertType');
const {DatabaseQueryFactory} = require('../../dataLayer/databaseQueryFactory');
const {ChangeEventProducer} = require('../../utils/changeEventProducer');
const {PostRequestProcessor} = require('../../utils/postRequestProcessor');
const {FhirLoggingManager} = require('../common/fhirLoggingManager');
const {ScopesValidator} = require('../security/scopesValidator');
const {DatabaseBulkInserter} = require('../../dataLayer/databaseBulkInserter');
const {getCircularReplacer} = require('../../utils/getCircularReplacer');
const {fhirContentTypes} = require('../../utils/contentTypes');
const {ParsedArgs} = require('../query/parsedArgs');
const {FhirResourceCreator} = require('../../fhir/fhirResourceCreator');
const {DatabaseAttachmentManager} = require('../../dataLayer/databaseAttachmentManager');
const {SensitiveDataProcessor} = require('../../utils/sensitiveDataProcessor');
const {ConfigManager} = require('../../utils/configManager');
const {DELETE, RETRIEVE} = require('../../constants').GRIDFS;
const { matchPersonLinks } = require('../../utils/personLinksMatcher');
const { BwellPersonFinder } = require('../../utils/bwellPersonFinder');

class PatchOperation {
    /**
     * constructor
     * @param {DatabaseQueryFactory} databaseQueryFactory
     * @param {ChangeEventProducer} changeEventProducer
     * @param {PostRequestProcessor} postRequestProcessor
     * @param {FhirLoggingManager} fhirLoggingManager
     * @param {ScopesValidator} scopesValidator
     * @param {DatabaseBulkInserter} databaseBulkInserter
     * @param {DatabaseAttachmentManager} databaseAttachmentManager
     * @param {SensitiveDataProcessor} sensitiveDataProcessor
     * @param {ConfigManager} configManager
     * @param {BwellPersonFinder} bwellPersonFinder
     */
    constructor(
        {
            databaseQueryFactory,
            changeEventProducer,
            postRequestProcessor,
            fhirLoggingManager,
            scopesValidator,
            databaseBulkInserter,
            databaseAttachmentManager,
            sensitiveDataProcessor,
            configManager,
            bwellPersonFinder
        }
    ) {
        /**
         * @type {DatabaseQueryFactory}
         */
        this.databaseQueryFactory = databaseQueryFactory;
        assertTypeEquals(databaseQueryFactory, DatabaseQueryFactory);
        /**
         * @type {ChangeEventProducer}
         */
        this.changeEventProducer = changeEventProducer;
        assertTypeEquals(changeEventProducer, ChangeEventProducer);
        /**
         * @type {PostRequestProcessor}
         */
        this.postRequestProcessor = postRequestProcessor;
        assertTypeEquals(postRequestProcessor, PostRequestProcessor);
        /**
         * @type {FhirLoggingManager}
         */
        this.fhirLoggingManager = fhirLoggingManager;
        assertTypeEquals(fhirLoggingManager, FhirLoggingManager);
        /**
         * @type {ScopesValidator}
         */
        this.scopesValidator = scopesValidator;
        assertTypeEquals(scopesValidator, ScopesValidator);
        /**
         * @type {DatabaseBulkInserter}
         */
        this.databaseBulkInserter = databaseBulkInserter;
        assertTypeEquals(databaseBulkInserter, DatabaseBulkInserter);
        /**
         * @type {DatabaseAttachmentManager}
         */
        this.databaseAttachmentManager = databaseAttachmentManager;
        assertTypeEquals(databaseAttachmentManager, DatabaseAttachmentManager);

        /**
         * @type {SensitiveDataProcessor}
         */
        this.sensitiveDataProcessor = sensitiveDataProcessor;
        assertTypeEquals(sensitiveDataProcessor, SensitiveDataProcessor);

        /**
         * @type {ConfigManager}
         */
        this.configManager = configManager;
        assertTypeEquals(configManager, ConfigManager);

        /**
         * @type {BwellPersonFinder}
         */
        this.bwellPersonFinder = bwellPersonFinder;
        assertTypeEquals(bwellPersonFinder, BwellPersonFinder);
    }

    /**
     * does a FHIR Patch
     * @param {FhirRequestInfo} requestInfo
     * @param {ParsedArgs} parsedArgs
     * @param {string} resourceType
     * @returns {{id: string,created: boolean, resource_version: string, resource: Resource}}
     */
    async patchAsync({requestInfo, parsedArgs, resourceType}) {
        assertIsValid(requestInfo !== undefined);
        assertIsValid(resourceType !== undefined);
        assertTypeEquals(parsedArgs, ParsedArgs);
        const currentOperationName = 'patch';
        const {
            requestId,
            method,
            body: patchContent,
            /** @type {import('content-type').ContentType} */ contentTypeFromHeader
        } = requestInfo;

        // currently we only support JSONPatch
        if (!contentTypeFromHeader || contentTypeFromHeader.type !== fhirContentTypes.jsonPatch) {
            const message = `Content-Type ${contentTypeFromHeader ? contentTypeFromHeader.type : ''} ` +
                'is not supported for patch. ' +
                `Only ${fhirContentTypes.jsonPatch} is supported.`;
            throw new BadRequestError(
                {
                    'message': message,
                    toString: function () {
                        return message;
                    }
                }
            );
        }

        /**
         * @type {number}
         */
        const startTime = Date.now();

        await this.scopesValidator.verifyHasValidScopesAsync({
            requestInfo,
            parsedArgs,
            resourceType,
            startTime,
            action: currentOperationName,
            accessRequested: 'write'
        });

        try {

            const currentDate = moment.utc().format('YYYY-MM-DD');
            // http://hl7.org/fhir/http.html#patch
            // patchContent is passed in JSON Patch format https://jsonpatch.com/
            let {base_version, id} = parsedArgs;
            // Get current record
            // Query our collection for this observation
            /**
             * @type {Resource}
             */
            let foundResource;
            try {
                const databaseQueryManager = this.databaseQueryFactory.createQuery(
                    {resourceType, base_version}
                );
                const idFieldMapper = new FieldMapper({useHistoryTable: false});
                const idField = idFieldMapper.getFieldName('id', id.toString());
                foundResource = await databaseQueryManager.findOneAsync({query: {[idField]: id.toString()}});
            } catch (e) {
                throw new NotFoundError(new Error(`Resource not found: ${resourceType}/${id}`));
            }
            if (!foundResource) {
                throw new NotFoundError('Resource not found');
            }
            const originalResource = foundResource.clone();
            foundResource = await this.databaseAttachmentManager.transformAttachments(
                foundResource, RETRIEVE, patchContent
            );

            // Validate the patch
            let errors = validate(patchContent, foundResource);
            if (errors) {
                const error = Array.isArray(errors) && errors.length && errors.find(e => !!e) ? errors.find(e => !!e) : errors;
                throw new BadRequestError(error);
            }
            // Make the changes indicated in the patch
            /**
             * @type {Object}
             */
            let resource_incoming = applyPatch(foundResource.toJSONInternal(), patchContent).newDocument;
            const appliedPatchContent = compare(foundResource.toJSONInternal(), resource_incoming);
            /**
             * @type {Resource}
             */
            let resource = FhirResourceCreator.createByResourceType(resource_incoming, resourceType);

            // source in metadata must exist either in incoming resource or found resource
            if (foundResource?.meta && (foundResource.meta.source || (resource?.meta?.source))) {
                let meta = foundResource.meta;
                // noinspection JSUnresolvedVariable
                meta.versionId = `${parseInt(foundResource.meta.versionId) + 1}`;
                meta.lastUpdated = new Date(moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'));
                meta.source = meta.source || resource.meta.source;
                resource.meta = meta;
            } else {
                throw new BadRequestError(new Error(
                    'Unable to patch resource. Missing either foundResource, metadata or metadata source.'
                ));
            }

            // removing the files that are patched
            await this.databaseAttachmentManager.transformAttachments(
                originalResource, DELETE, appliedPatchContent.filter(patch => patch.op !== 'add')
            );

            // converting attachment.data to attachment._file_id for the response
            resource = await this.databaseAttachmentManager.transformAttachments(resource);

            // The access tags are updated before updating the resources.
            // If access tags is to be updated call the corresponding processor
            if (this.configManager.enabledAccessTagUpdate) {
                await this.sensitiveDataProcessor.updateResourceSecurityAccessTag({
                    resource: resource,
                });
            }

            // Same as update from this point on
            // Insert/update our resource record
            await this.databaseBulkInserter.replaceOneAsync(
                {
                    requestId, resourceType, doc: resource,
                    uuid: resource._uuid,
                    patches: patchContent.map(
                        p => {
                            return {
                                op: p.op,
                                path: p.path,
                                value: p.value
                            };
                        }
                    )
                }
            );
            /**
             * @type {MergeResultEntry[]}
             */
            const mergeResults = await this.databaseBulkInserter.executeAsync(
                {
                    requestId, currentDate, base_version: base_version,
                    method
                }
            );
            if (!mergeResults || mergeResults.length === 0 || (!mergeResults[0].created && !mergeResults[0].updated)) {
                throw new BadRequestError(new Error(JSON.stringify(mergeResults[0].issue, getCircularReplacer())));
            }

            await this.fhirLoggingManager.logOperationSuccessAsync(
                {
                    requestInfo,
                    args: parsedArgs.getRawArgs(),
                    resourceType,
                    startTime,
                    action: currentOperationName
                });


            this.postRequestProcessor.add({
                requestId,
                fnTask: async () => {
                    await this.changeEventProducer.fireEventsAsync({
                        requestId, eventType: 'U', resourceType, doc: resource
                    });
                    await this.changeEventProducer.flushAsync({requestId});
                }
            });
            if (this.configManager.enabledAccessTagUpdate) {
                this.postRequestProcessor.add({
                    requestId,
                    fnTask: async () => {
                        if (mergeResults[0].resourceType === 'Consent' && (mergeResults[0].created || mergeResults[0].updated)) {
                            await this.sensitiveDataProcessor.processPatientConsentChange({requestId: requestId, resources: [resource]});
                        }
                        if (
                            mergeResults[0].resourceType === 'Person' &&
                            (mergeResults[0].created || mergeResults[0].updated) &&
                            this.bwellPersonFinder.isBwellPerson(resource_incoming) &&
                            !matchPersonLinks(resource_incoming.link, foundResource.link)
                        ) {
                            await this.sensitiveDataProcessor.processPersonLinkChange({requestId: requestId, resources: [resource]});
                        }
                    }
                });
            }

            // converting attachment._file_id to attachment.data for the response
            resource = await this.databaseAttachmentManager.transformAttachments(resource, RETRIEVE);

            return {
                id: resource.id,
                created: false,
                updated: true,
                resource_version: resource.meta.versionId,
                resource: resource
            };
        } catch (e) {
            await this.fhirLoggingManager.logOperationFailureAsync(
                {
                    requestInfo,
                    args: parsedArgs.getRawArgs(),
                    resourceType,
                    startTime,
                    action: currentOperationName,
                    error: e
                });
            throw e;
        }
    }
}

module.exports = {
    PatchOperation
};
