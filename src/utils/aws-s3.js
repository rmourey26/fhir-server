/**
 * This file implements helper functions for AWS
 */

const {S3} = require('@aws-sdk/client-s3'),
    {STS} = require('@aws-sdk/client-sts');
const {
    getLogger
} = require('../winstonInit');

/**
 * @type {import('winston').logger}
 */
const logger = getLogger();
const moment = require('moment-timezone');

const AWS_BUCKET = process.env.AWS_BUCKET;
const REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_FOLDER = process.env.AWS_FOLDER;

const s3 = new S3({
    region: REGION,
});

/**
 * @function sendToS3
 * @description In case of FHIR Server failure, dump form body to S3
 * @param prefix
 * @param resourceType
 * @param {*} resource - parsed form body
 * @param currentDate
 * @param {*} id - first name for key
 * @param filename_postfix - Optional postfix for filename
 * @return {Promise<data|err>}
 */
module.exports = function sendToS3(prefix, resourceType, resource, currentDate, id, filename_postfix) {
    if (!AWS_BUCKET) {
        return Promise.resolve(null);
    }
    const currentTime = moment.utc().format('HH-mm-ss');
    const randomString = Math.random().toString(36).substring(0, 5);
    const key = `${AWS_FOLDER}/${prefix}/${resourceType}/${currentDate}/${id}/${currentTime}-${filename_postfix}-${randomString}.json`;
    return new Promise((resolve, reject) => {
        try {
            const params = {
                Body: JSON.stringify(resource),
                Bucket: AWS_BUCKET,
                Key: key,
                ContentType: 'application/json',
                ServerSideEncryption: 'AES256',
            };
            s3.putObject(params, function (err, data) {
                if (err) {
                    const sts = new STS({});
                    sts.getCallerIdentity(function (_error, role_data) {
                        logger.error('[AWS-S3] Failed to put object: ' +
                            key + ' in bucket: ' + AWS_BUCKET + ': ' + key + ' with user: ' + JSON.stringify(role_data));
                        logger.error(
                            '[AWS-S3] Object: ',
                            JSON.stringify(resource)
                        );
                        logger.error('[AWS-S3] Error: ' + key + ':', err);
                        return reject(err);
                    });
                } else {
                    logger.info('[AWS-S3] Successfully placed object in bucket' + AWS_BUCKET + ': ' + key);
                    return resolve(data);
                }
            });
        } catch (e) {
            logger.error('[AWS-S3] Error to put object: ' +
                key + ' in bucket: ' + AWS_BUCKET + ': ' + key + '. Error=' + e);
            return resolve(null);
        }
    }).catch(function (e) {
        logger.error('[AWS-S3] Error in promise to put object: ' +
            key + ' in bucket: ' + AWS_BUCKET + ': ' + key + '. Error=' + e);
    });
};
