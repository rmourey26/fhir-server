/**
 * This middleware handles graphql requests
 */
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const {join} = require('path');
const resolvers = require('../../graphql/v2/resolvers');
const {REQUEST_ID_HEADER} = require('../../constants');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeTypeDefs} = require('@graphql-tools/merge');
const {FhirDataSource} = require('../../graphql/v2/dataSource');

const {
    ApolloServerPluginLandingPageLocalDefault,
    // ApolloServerPluginLandingPageProductionDefault
} = require('@apollo/server/plugin/landingPage/default');

const {getBundleMetaApolloServerPlugin} = require('./plugins/graphqlBundleMetaPlugin');
const {getApolloServerLoggingPlugin} = require('./plugins/graphqlLoggingPlugin');
const {FhirRequestInfo} = require('../../utils/fhirRequestInfo');
const {generateUUID} = require('../../utils/uid.util');
const {getAddRequestIdToResponseHeadersPlugin} = require('./plugins/graphqlAddRequestIdToResponseHeadersPlugin');
const contentType = require('content-type');
const {getValidateMissingVariableValuesPlugin} = require('./plugins/graphqlValidateMissingVariableValuesPlugin');
const httpContext = require('express-http-context');


/**
 * @param {function (): SimpleContainer} fnCreateContainer
 * @return {Promise<e.Router>}
 */
const graphql = async (fnCreateContainer) => {
    const typesArray = loadFilesSync(join(__dirname, '../../graphql/v2/schemas/'), {recursive: true});
    const typeDefs = mergeTypeDefs(typesArray);

    /**
     * @type {import('apollo-server-plugin-base').PluginDefinition[]}
     */
    const plugins = [
        // request.credentials is set so we receive cookies
        // https://github.com/graphql/graphql-playground#settings
        // eslint-disable-next-line new-cap
        ApolloServerPluginLandingPageLocalDefault(),
        getBundleMetaApolloServerPlugin(),
        getApolloServerLoggingPlugin('graphqlv2'),
        getAddRequestIdToResponseHeadersPlugin(),
        // ApolloServerPluginLandingPageDisabled()
        getValidateMissingVariableValuesPlugin(),
    ];

    /**
     * gets context
     * @param {import('http').IncomingMessage} req
     * @param {import('http').ServerResponse} res
     * @return {Promise<GraphQLContext>}
     */
    async function getContext({req, res}) {
        const container = fnCreateContainer();

        req.id = req.id || req.header(`${REQUEST_ID_HEADER}`) || generateUUID();
        httpContext.set('requestId', req.id);
        /**
         * @type {import('content-type').ContentType}
         */
        const contentTypeFromHeader = req.headers['content-type'] ? contentType.parse(req.headers['content-type']) : null;
        /**
         * @type {FhirRequestInfo}
         */
        const fhirRequestInfo = new FhirRequestInfo(
            {
                user: (req.authInfo && req.authInfo.context && req.authInfo.context.username) ||
                    (req.authInfo && req.authInfo.context && req.authInfo.context.subject) ||
                    ((!req.user || typeof req.user === 'string') ? req.user : req.user.name || req.user.id),
                patientIdsFromJwtToken: req.authInfo && req.authInfo.context && req.authInfo.context.patientIdsFromJwtToken,
                scope: req.authInfo && req.authInfo.scope,
                remoteIpAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                requestId: req.id,
                protocol: req.protocol,
                originalUrl: req.originalUrl,
                path: req.path,
                host: req.hostname,
                body: req.body,
                isUser: req.authInfo && req.authInfo.context && req.authInfo.context.isUser,
                personIdFromJwtToken: req.authInfo && req.authInfo.context && req.authInfo.context.personIdFromJwtToken,
                headers: req.headers,
                method: req.method,
                contentTypeFromHeader
            });

        req.container = container;
        return {
            req,
            res,
            fhirRequestInfo,
            dataApi: new FhirDataSource(
                {
                    requestInfo: fhirRequestInfo,
                    searchBundleOperation: container.searchBundleOperation,
                    r4ArgsParser: container.r4ArgsParser,
                    queryRewriterManager: container.queryRewriterManager
                }
            ),
            container: container
        };

    }

    // create the Apollo graphql middleware
    const server = new ApolloServer(
        {
            // schema: schemaWithResolvers,
            typeDefs: typeDefs,
            resolvers: resolvers,
            introspection: true,
            cache: 'bounded',
            plugins: plugins,
            // formatError: (formattedError, error) => {
            //     // if (unwrapResolverError(error) instanceof ForbiddenError) {
            //     //     return {message: 'Internal server error'};
            //     // }
            //     // Otherwise return the formatted error. This error can also
            //     // be manipulated in other ways, as long as it's returned.
            //     return formattedError;
            // },
        });

    // apollo requires us to start the server first
    await server.start();

    return expressMiddleware(server, {
        context: async ({req, res}) => await getContext({req, res})
    });
};

module.exports.graphql = graphql;
