const {FhirOperationsManager} = require('../../../../operations/fhirOperationsManager');
const {PostRequestProcessor} = require('../../../../utils/postRequestProcessor');
const {assertTypeEquals} = require('../../../../utils/assertType');
const {FhirResponseWriter} = require('../../fhirResponseWriter');
const {RequestSpecificCache} = require('../../../../utils/requestSpecificCache');

class CustomOperationsController {
    /**
     * constructor
     * @param {PostRequestProcessor} postRequestProcessor
     * @param {FhirOperationsManager} fhirOperationsManager
     * @param {FhirResponseWriter} fhirResponseWriter
     * @param {RequestSpecificCache} requestSpecificCache
     */
    constructor({
                    postRequestProcessor,
                    fhirOperationsManager,
                    fhirResponseWriter,
                    requestSpecificCache
                }) {
        assertTypeEquals(postRequestProcessor, PostRequestProcessor);
        /**
         * @type {PostRequestProcessor}
         */
        this.postRequestProcessor = postRequestProcessor;
        assertTypeEquals(fhirOperationsManager, FhirOperationsManager);
        /**
         * @type {FhirOperationsManager}
         */
        this.fhirOperationsManager = fhirOperationsManager;
        /**
         * @type {FhirResponseWriter}
         */
        this.fhirResponseWriter = fhirResponseWriter;
        assertTypeEquals(fhirResponseWriter, FhirResponseWriter);

        /**
         * @type {RequestSpecificCache}
         */
        this.requestSpecificCache = requestSpecificCache;
        assertTypeEquals(requestSpecificCache, RequestSpecificCache);
    }

    /**
     * @description Controller for all POST operations
     * @param {name: string, resourceType: string}
     */
    operationsPost(
        {
            name,
            resourceType
        }) {
        return async (
            /** @type {import('http').IncomingMessage}*/req,
            /** @type {import('http').ServerResponse}*/res,
            /** @type {function() : void}*/next) => {
            let {
                base_version,
                id
            } = req.sanitized_args;
            let resource_body = req.body;
            let args = {
                id,
                base_version,
                resource: resource_body
            };

            try {
                const result = await this.fhirOperationsManager[`${name}`](args, {
                    req, res
                }, resourceType);
                if (name === 'merge') {
                    this.fhirResponseWriter.merge({req, res, result});
                } else if (name === 'graph') {
                    this.fhirResponseWriter.graph({req, res, result});
                } else if (name === 'everything') {
                    this.fhirResponseWriter.everything({req, res, result});
                } else {
                    this.fhirResponseWriter.readCustomOperation({req, res, result});
                }
            } catch (e) {
                next(e);
            } finally {
                const requestId = req.id;
                await this.postRequestProcessor.executeAsync({requestId});
                await this.requestSpecificCache.clearAsync({requestId});
            }
        };
    }

    /**
     * @description Controller for all DELETE operations
     * @param {name: string, resourceType: string}
     */
    operationsDelete(
        {
            name,
            resourceType
        }) {
        return async (
            /** @type {import('http').IncomingMessage}*/req,
            /** @type {import('http').ServerResponse}*/res,
            /** @type {function() : void}*/next) => {
            let {
                base_version,
                id
            } = req.sanitized_args;
            let resource_body = req.body;
            let args = {
                id,
                base_version,
                resource: resource_body
            };

            try {
                const result = await this.fhirOperationsManager[`${name}`](args, {
                    req, res
                }, resourceType);
                this.fhirResponseWriter.readCustomOperation({req, res, result});
            } catch (e) {
                next(e);
            } finally {
                const requestId = req.id;
                await this.postRequestProcessor.executeAsync({requestId});
                await this.requestSpecificCache.clearAsync({requestId});
            }
        };
    }

    /**
     * @description Controller for all GET operations
     * @param {name: string, resourceType: string}
     */
    operationsGet(
        {
            name,
            resourceType
        }) {
        return async (
            /** @type {import('http').IncomingMessage}*/req,
            /** @type {import('http').ServerResponse}*/res,
            /** @type {function() : void}*/next) => {
            try {
                const result = await
                    this.fhirOperationsManager[`${name}`](req.sanitized_args, {
                        req, res
                    }, resourceType);
                if (name === 'graph') {
                    this.fhirResponseWriter.graph({req, res, result});
                } else if (name === 'everything') {
                    this.fhirResponseWriter.everything({req, res, result});
                } else {
                    this.fhirResponseWriter.readCustomOperation({req, res, result});
                }
            } catch (e) {
                next(e);
            } finally {
                const requestId = req.id;
                await this.postRequestProcessor.executeAsync({requestId});
                await this.requestSpecificCache.clearAsync({requestId});
            }
        };
    }
}

module.exports = {
    CustomOperationsController
};

