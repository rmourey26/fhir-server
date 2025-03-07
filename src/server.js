const {createApp} = require('./app');
const {fhirServerConfig} = require('./config');
const env = require('var');
const {logError, logInfo, logSystemEventAsync} = require('./operations/common/logging');
const {createHttpTerminator} = require('http-terminator');
const http = require('http');
const { initErrorHandler } = require('./middleware/errorHandler');
const { isTrue } = require('./utils/isTrue');
const {getImageVersion} = require('./utils/getImageVersion');
const {MongoDatabaseManager} = require('./utils/mongoDatabaseManager');

/**
 * Creates the http server
 * @param {function (): SimpleContainer} fnCreateContainer
 * @return {Promise<import('http').Server>}
 */
async function createServer(fnCreateContainer) {
    await new MongoDatabaseManager().connectAsync();

    const app = createApp({fnCreateContainer, trackMetrics: isTrue(env.TRACK_METRICS)});

    const server = http
        .createServer(app)
        .listen(fhirServerConfig.server.port, null, null, async () => {
            const image = env.DOCKER_IMAGE || '';
            await logSystemEventAsync({
                event: 'serverStartup',
                message: 'Server is up and running',
                args: {image: image, version: getImageVersion()},
            });
        });

    // https://stackoverflow.com/questions/56606305/difference-between-keepalivetimeout-and-timeout
    // https://www.w3schools.com/nodejs/prop_server_timeout.asp
    // The number of milliseconds of inactivity before a socket is presumed to have timed out.
    // A value of 0 will disable the timeout behavior on incoming connections.
    server.setTimeout(10 * 60 * 1000, (/*socket*/) => {
        logInfo('Server timeout', {});
    }); // 60 minutes
    // The number of milliseconds of inactivity a server needs to wait for additional incoming data, after it has
    // finished writing the last response, before a socket will be destroyed. If the server receives new data
    // before the keep-alive timeout has fired, it will reset the regular inactivity timeout, i.e., server.timeout.
    // A value of 0 will disable the keep-alive timeout behavior on incoming connections. A value of 0 makes the
    // http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
    // Timeout in milliseconds. Default: 5000 (5 seconds).
    server.keepAliveTimeout = 10 * 60 * 1000;

    server.on('connection', function (socket) {
        socket.setTimeout(10 * 60 * 1000);
        socket.once('timeout', function () {
            logInfo('Socket timeout', {});
        });
        socket.once('error', function (e) {
            logError('Socket error', {error: e});
        });
    });

    const httpTerminator = createHttpTerminator({
        server,
        gracefulTerminationTimeout: 7000,
    });

    const signalListener = eventName => async () => {
        logInfo(`Beginning shutdown of server for ${eventName}`, {});
        await logSystemEventAsync({
            event: eventName,
            message: `Beginning shutdown of server for ${eventName}`,
            args: {},
        });
        try {
            await httpTerminator.terminate();
            logInfo(`Successfully shut down server for ${eventName}`, {});
            process.exit(0);
        } catch (error) {
            logError(`Failed to shutdown server for ${eventName}`, {error: error});
            process.exit(1);
        }
    };

    initErrorHandler(httpTerminator);

    process.on('SIGTERM', signalListener('SIGTERM'));

    // https://snyk.io/wp-content/uploads/10-best-practices-to-containerize-Node.js-web-applications-with-Docker.pdf
    process.on('SIGINT', signalListener('SIGINT'));
    process.on('SIGQUIT', signalListener('SIGQUIT'));

    return server;
}

module.exports = {
    createServer,
};
