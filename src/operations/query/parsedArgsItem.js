const {ParsedReferenceItem} = require('./parsedReferenceItem');
const {assertIsValid, assertTypeEquals} = require('../../utils/assertType');
const {QueryParameterValue} = require('./queryParameterValue');
const {SearchParameterDefinition} = require('../../searchParameters/searchParameterTypes');
const {ReferenceParser} = require('../../utils/referenceParser');
const {removeNull} = require('../../utils/nullRemover');

/**
 * @classdesc This class holds the parsed structure for an arg on the url
 */
class ParsedArgsItem {
    /**
     * constructor
     * @param {string} queryParameter
     * @param {QueryParameterValue} queryParameterValue
     * @param {SearchParameterDefinition|undefined} propertyObj
     * @param {string[]|undefined} modifiers
     * @param {ParsedReferenceItem[]|undefined} [references]
     */
    constructor(
        {
            queryParameter,
            queryParameterValue,
            propertyObj,
            modifiers,
            references
        }
    ) {
        /**'
         * @type {string}
         */
        this.queryParameter = queryParameter;
        /**
         * @type {QueryParameterValue}
         */
        this._queryParameterValue = queryParameterValue;
        assertTypeEquals(queryParameterValue, QueryParameterValue);
        /**
         * @type {SearchParameterDefinition|undefined}
         */
        this.propertyObj = propertyObj;
        if (propertyObj) {
            assertTypeEquals(propertyObj, SearchParameterDefinition);
        }
        /**
         * @type {string[]}
         */
        this.modifiers = modifiers;
        if (modifiers.length) {
            this.applyModifierToQueryParameterValue();
        }
        /**
         * @type {ParsedReferenceItem[]}
         */
        this.references = references;
        if (!references) {
            this.updateReferences();
        }
    }

    /**
     * Changes queryParameterValue if modifier contains resource types of target references
     */
    applyModifierToQueryParameterValue() {
        if (!this.propertyObj || !this.queryParameterValue) {
            return;
        }

        let modifiedQueryParameterValues = [];
        this.modifiers.forEach(modifier => {
            if (this.propertyObj.target && this.propertyObj.target.includes(modifier) && this.queryParameterValue.value) {
                const queryParameterValues = this.queryParameterValue.value.split(',');
                queryParameterValues.forEach(value => {
                    if (value && value.includes('/')) {
                        modifiedQueryParameterValues.push(`${value}`);
                    } else {
                        modifiedQueryParameterValues.push(`${modifier}/${value}`);
                    }
                });
            }
        });

        if (modifiedQueryParameterValues.length) {
            this.queryParameterValue = new QueryParameterValue({
                value: modifiedQueryParameterValues.join(), operator: this.queryParameterValue.operator
            });
        }
    }

    /**
     * calculates query parameter value
     * @return {QueryParameterValue|null}
     */
    get queryParameterValue() {
        return this._queryParameterValue;
    }

    /**
     * sets the queryParameterValue
     * @param {QueryParameterValue} value
     */
    set queryParameterValue(value) {
        assertTypeEquals(value, QueryParameterValue);
        this._queryParameterValue = value;
        this.updateReferences();
    }

    /**
     * calculate references
     */
    updateReferences() {
        this.references = this.parseQueryParameterValueIntoReferences(
            {
                queryParameterValue: this.queryParameterValue,
                propertyObj: this.propertyObj
            }
        );
    }

    /**
     * parses a query parameter value for reference into resourceType, id
     * @param {QueryParameterValue} queryParameterValue
     * @param {SearchParameterDefinition|undefined} propertyObj
     * @return {ParsedReferenceItem[]}
     */
    parseQueryParameterValueIntoReferences({queryParameterValue, propertyObj}) {
        assertTypeEquals(queryParameterValue, QueryParameterValue);
        if (!propertyObj) {
            return [];
        }

        assertTypeEquals(propertyObj, SearchParameterDefinition);
        if (!(propertyObj.target)) {
            return [];
        }
        /**
         * @type {ParsedReferenceItem[]}
         */
        const result = [];
        /**
         * @type {string[]|null}
         */
        const queryParameterValues = queryParameterValue.values;
        // The forms are:
        // 1. Patient/123,456
        // 2. 123,456
        // 3. Patient/123, Patient/456
        if (queryParameterValues) {
            assertIsValid(Array.isArray(queryParameterValues), `queryParameterValues is not an array but ${typeof queryParameterValues}`);
            for (const /** @type {string} */ val of queryParameterValues) {
                const {resourceType, id, sourceAssigningAuthority} = ReferenceParser.parseReference(val);
                if (resourceType) {
                    // resource type was specified
                    result.push(
                        new ParsedReferenceItem({
                            resourceType,
                            id,
                            sourceAssigningAuthority
                        })
                    );
                } else {
                    for (const target of propertyObj.target) {
                        result.push(
                            new ParsedReferenceItem({
                                resourceType: target,
                                id,
                                sourceAssigningAuthority
                            })
                        );
                    }
                }
            }
        }

        return result;
    }

    clone() {
        return new ParsedArgsItem(
            {
                queryParameter: this.queryParameter,
                queryParameterValue: this._queryParameterValue.clone(),
                propertyObj: this.propertyObj ? this.propertyObj.clone() : undefined,
                modifiers: this.modifiers,
                references: this.references ? this.references.map(r => r.clone()) : undefined
            }
        );
    }

    /**
     * Returns JSON representation of entity
     * @return {Object}
     */
    toJSON() {
        return removeNull({
            queryParameter: this.queryParameter,
            queryParameterValue: this._queryParameterValue.toJSON(),
            propertyObj: this.propertyObj ? this.propertyObj.toJSON() : undefined,
            modifiers: this.modifiers,
            references: this.references ? this.references.map(r => r.toJSON()) : undefined
        });
    }
}


module.exports = {
    ParsedArgsItem
};
