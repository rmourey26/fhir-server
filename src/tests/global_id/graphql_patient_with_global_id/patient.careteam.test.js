const expectedGraphQlResponse = require('./fixtures/expected_careteam_graphql_response.json');
const patientBundleResource = require('./fixtures/patients.json');
const practitionerBundleResource = require('./fixtures/practitioners.json');

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const query = fs.readFileSync(path.resolve(__dirname, './fixtures/updateCareTeam.graphql'), 'utf8');

const {
    commonBeforeEach,
    commonAfterEach,
    getHeaders,
    getGraphQLHeaders,
    createTestRequest,
} = require('../../common');
const { describe, beforeEach, afterEach, expect, test } = require('@jest/globals');

describe('GraphQL Patient Update Care Team Tests', () => {
    beforeEach(async () => {
        await commonBeforeEach();
    });

    afterEach(async () => {
        await commonAfterEach();
    });

    describe('GraphQL Patient Update Care Team', () => {
        test('GraphQL Update General Practitioner for Patient', async () => {
            const request = await createTestRequest();
            const graphqlQueryText = query.replace(/\\n/g, '');

            let resp = await request.get('/4_0_0/Patient').set(getHeaders()).expect(200);
            console.log('------- end response 1 ------------');

            resp = await request.get('/4_0_0/Practitioner').set(getHeaders()).expect(200);
            expect(resp.body.length).toBe(0);

            resp = await request.get('/4_0_0/CareTeam').set(getHeaders()).expect(200);
            expect(resp.body.length).toBe(0);

            resp = await request
                .post('/4_0_0/Patient/1/$merge')
                .send(patientBundleResource)
                .set(getHeaders())
                .expect(200);

            resp = await request
                .post('/4_0_0/Practitioner/1/$merge')
                .send(practitionerBundleResource)
                .set(getHeaders())
                .expect(200);

            resp = await request.get('/4_0_0/Patient/').set(getHeaders()).expect(200);

            resp = await request.get('/4_0_0/Practitioner/').set(getHeaders()).expect(200);

            resp = await request
                .post('/graphqlv2')
                .send({
                    operationName: null,
                    variables: {},
                    query: graphqlQueryText,
                })
                .set(getGraphQLHeaders())
                .expect(200);

            let body = resp.body;
            if (body.errors) {
                console.log(body.errors);
                expect(body.errors).toBeUndefined();
            }
            // noinspection JSUnresolvedFunction
            expect(resp).toHaveResponse(expectedGraphQlResponse);
            resp = await request.get('/4_0_0/CareTeam/').set(getHeaders()).expect(200);
            expect(resp.body.length).toBe(1);
        });
    });
});
