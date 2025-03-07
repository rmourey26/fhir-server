// provider file
const patient1Resource = require('./fixtures/patient/patient1.json');

const {
    commonBeforeEach,
    commonAfterEach,
    getHeaders,
    getHtmlHeaders,
    createTestRequest, getHtmlHeadersWithForm,
} = require('../../common');
const {describe, beforeEach, afterEach, expect, test} = require('@jest/globals');
const {logInfo} = require('../../../operations/common/logging');

describe('Patient UI Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('Patient Search By Id Tests', () => {
        test('search by single name works', async () => {
            const request = await createTestRequest();
            let resp = await request.get('/4_0_0/Patient').set(getHeaders());
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveResourceCount(0);

            resp = await request
                .post('/4_0_0/Patient/1679033641/$merge?validate=true')
                .send(patient1Resource)
                .set(getHeaders());
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveMergeResponse({created: true});

            resp = await request.get('/4_0_0/Patient').set(getHeaders());
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveResourceCount(1);

            resp = await request
                .get('/4_0_0/Patient/00100000000')
                .set(getHtmlHeaders());
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveStatusOk();

            logInfo('------- response Patient sorted ------------', {});
            logInfo('', {resp});
            logInfo('------- end response sort ------------', {});
            expect(resp.type).toStrictEqual('text/html');
            expect(resp.body).toStrictEqual({});
            expect(resp.text).not.toBeNull();
            expect(resp.text).toMatch(new RegExp('SHYLA'));

            const body = {
                'address:contains': '',
                'address-city:contains': '',
                'address-country:contains': '',
                'address-postalcode:contains': '',
                'address-state:contains': '',
                'name:contains': '',
                'phonetic:contains': '',
                '_lastUpdated': ['', ''],
                'given': 'SHYLA',
                'family': 'PATIENT1',
                'email': '',
                '_security': '',
                'id': '',
                'identifier': ['', ''],
                '_source:contains': '',
                '_getpagesoffset': '',
                '_sort': '',
                '_count': '100'
            };
            resp = await request
                .post('/4_0_0/Patient/_search')
                .send(body)
                .set(getHtmlHeadersWithForm());

            // noinspection JSUnresolvedFunction
            expect(resp).toHaveStatusOk();

            logInfo('------- response Patient sorted ------------', {});
            logInfo('', {resp});
            logInfo('------- end response sort ------------', {});
            expect(resp.type).toStrictEqual('text/html');
            expect(resp.body).toStrictEqual({});
            expect(resp.text).not.toBeNull();
            expect(resp.text).toMatch(new RegExp('SHYLA'));

            const form = 'address%3Acontains=&address-city%3Acontains=&address-country%3Acontains=&address-postalcode%3Acontains=&address-state%3Acontains=&name%3Acontains=&phonetic%3Acontains=&_lastUpdated=&_lastUpdated=&given=SHYLA&family=PATIENT1&email=&_security=&id=&identifier=&_source%3Acontains=&identifier=&_getpagesoffset=&_sort=&_count=100';
            resp = await request
                .post('/4_0_0/Patient/_search')
                .send(form)
                .set(getHtmlHeadersWithForm());

            // noinspection JSUnresolvedFunction
            expect(resp).toHaveStatusOk();

            logInfo('------- response Patient sorted ------------', {});
            logInfo('', {resp});
            logInfo('------- end response sort ------------', {});
            expect(resp.type).toStrictEqual('text/html');
            expect(resp.body).toStrictEqual({});
            expect(resp.text).not.toBeNull();
            expect(resp.text).toMatch(new RegExp('SHYLA'));
        });
        test('search by single name works with form', async () => {
            const request = await createTestRequest();
            let resp = await request
                .post('/4_0_0/Patient/1679033641/$merge?validate=true')
                .send(patient1Resource)
                .set(getHeaders());
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveMergeResponse({created: true});

            const form = 'address%3Acontains=&address-city%3Acontains=&address-country%3Acontains=&address-postalcode%3Acontains=&address-state%3Acontains=&name%3Acontains=&phonetic%3Acontains=&_lastUpdated=&_lastUpdated=&given=SHYLA&family=PATIENT1&email=&_security=&id=&identifier=&_source%3Acontains=&identifier=&_getpagesoffset=&_sort=&_count=100';
            resp = await request
                .post('/4_0_0/Patient/_search')
                .send(form)
                .set(getHtmlHeadersWithForm());

            // noinspection JSUnresolvedFunction
            expect(resp).toHaveStatusOk();

            logInfo('------- response Patient sorted ------------', {});
            logInfo('', {resp});
            logInfo('------- end response sort ------------', {});
            expect(resp.type).toStrictEqual('text/html');
            expect(resp.body).toStrictEqual({});
            expect(resp.text).not.toBeNull();
            expect(resp.text).toMatch(new RegExp('SHYLA'));
        });
    });
});
