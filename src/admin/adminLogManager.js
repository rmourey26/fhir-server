const env = require('var');
const {assertIsValid} = require('../utils/assertType');
const {Client} = require('@opensearch-project/opensearch');
const {logInfo, logError} = require('../operations/common/logging');
const {isTrue} = require('../utils/isTrue');
const {accessLogsMongoConfig} = require('../config');
const {MongoClient} = require('mongodb');

class AdminLogManager {

    /**
     * gets logs
     * @param id
     * @returns {Promise<Object[]>}
     */
    async getLogAsync(id) {
        if (isTrue(env.ENABLE_MONGODB_ACCESS_LOGS_SEARCH)) {
            /**
             * @type {MongoClient}
             */
            const client = new MongoClient(accessLogsMongoConfig.connection, accessLogsMongoConfig.options);

            const accessLogsCollectionName = env.ACCESS_LOGS_COLLECTION_NAME ? String(env.ACCESS_LOGS_COLLECTION_NAME) : 'access_logs';

            const accessLogsDb = client.db(accessLogsMongoConfig.db_name);

            const accessLogsCollection = accessLogsDb.collection(accessLogsCollectionName);

            return await accessLogsCollection.find({ 'meta.id': { $eq: id } }).toArray();
        }
        if (!env.LOG_ELASTIC_SEARCH_URL){
            return [];
        }
        // https://vpc-prod-shared-elasticsearch-o7pgs5fwj7yxm5kylp5flpbkza.us-east-1.es.amazonaws.com/
        // fhir-staging-logs-*/_search?q=020c89c4-dfb9-49a0-acc7-ef8c42ebcce6

        let node = env.LOG_ELASTIC_SEARCH_URL;
        assertIsValid(node, 'LOG_ELASTIC_SEARCH_URL environment variable is not defined but LOG_ELASTIC_SEARCH_ENABLE is set');
        logInfo(`Reading from ${node}`, {});
        const username = env.ELASTIC_SEARCH_USERNAME;
        const password = env.ELASTIC_SEARCH_PASSWORD;
        assertIsValid(username);
        assertIsValid(typeof username === 'string');
        assertIsValid(password);
        assertIsValid(typeof password === 'string');
        logInfo(`Reading from ${node} with username: ${username}`, {});
        node = node.replace('https://', `https://${username}:${password}@`);

        /**
         * @type {Client}
         */
        const client = new Client({
            node: node,
            ssl: {
                rejectUnauthorized: env.NODE_ENV !== 'development' // skip cert verification on local
            }
        });

        const indexPrefix = env.LOG_ELASTIC_SEARCH_PREFIX ?
            String(env.LOG_ELASTIC_SEARCH_PREFIX).toLowerCase() + '-*' :
            'logs';

        const body = {
            query: {
                term: {
                    'fields.id.keyword': id
                }
            }
        };
        logInfo(`Searching in index ${indexPrefix} for query`, {body});

        try {
            // Let's search!
            const result = await client.search({
                index: indexPrefix,
                body
            });

            logInfo('', {result});
            logInfo('', {'body': result.body});
            logInfo('', {'body hits': result.body.hits});
            logInfo('', {'body hits hits': result.body.hits.hits});

            return result.body.hits.hits;
        } catch (e) {
            logError(e.message, {'error': e});
        }
        return [];
    }
}

module.exports = {
    AdminLogManager
};
