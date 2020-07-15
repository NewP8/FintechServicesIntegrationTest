const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

const CLIENT_TENANT_ID = process.env.CLIENT_TENANT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

/* Token */

function createServerToken(clientId, clientSecret, grant_type, scope) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    return baseUrl
        .get('/rest/v1/oauth2/token')
        .query({grant_type:grant_type, scope:scope})
        .set('Authorization', `Basic ${credentials}`)
        .expect(200)
        .then(function(result) {
          const token = result.text;
          expect(token).to.be.a('string', "Couldn't get Token");
          return token;
        });
}

function createUserToken(token, tenantId, userId) {
    return baseUrl
        .post(`/rest/v1/account/tenants/${tenantId}/users/${userId}/tokens`)
        .send({scopes: []})
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(result => {
            const userToken = result.body;
            expect(userToken).to.be.an('object', "Couldn't get userToken");
            return userToken;
          })  
}

/* Web Hook */

function addWebHook(token, tenantId, idempotencyKey, webhookRequest) {
  return baseUrl
  .post(`/rest/v1/fintech/tenants/${tenantId}/hooks`)
  .set('Idempotency-Key', idempotencyKey)
  .send(webhookRequest)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const webhook = result.body;
      expect(webhook).to.be.an('object', "Couldn't get Webhook");
      return webhook;
    })     
}



module.exports = {
    CLIENT_TENANT_ID,
    CLIENT_SECRET,
    createServerToken,
    createUserToken,
    addWebHook
};

