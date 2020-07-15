const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);


/* Qr Auth */

function setQrAuths(fintechToken, tenantId) {
    return baseUrl
        .post(`/rest/v1/fintech/tenants/${tenantId}/qrauths`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fintechToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
          const body = result.body;
          expect(body).to.be.an('Object', "Couldn't get response object");
          return body
        })
}



function setQrAuthsToken(fintechToken, tenantId, qrAuthTokenId, userId) {
    return baseUrl
        .post(`/rest/v1/fintech/tenants/${tenantId}/qrauths/${qrAuthTokenId}/users/${userId}`)
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fintechToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
          const body = result.body;
          expect(body).to.be.an('Object', "Couldn't get response object");
          return body
        })
}

module.exports = {
  setQrAuths,
  setQrAuthsToken
};


