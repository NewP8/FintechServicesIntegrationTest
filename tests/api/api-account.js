const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

/* User */

function createUserFintech(fintechToken, idempotencyKey, tenantId, userRequest) {
  return baseUrl
    .post(`/rest/identity/tenants/${tenantId}/users`)
    .send(userRequest)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .set('Idempotency-Key', idempotencyKey)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const user = result.body;
      expect(user).to.be.an('object', "Couldn't get user");
      return user;
    });
}


function updateUserFromId(fintechToken, tenantId, userId, request) {
  return baseUrl
    .put(`/rest/identity/tenants/${tenantId}/users/${userId}`)
    .send(request)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const user = result.body;
      expect(user).to.be.an('object', "Couldn't get user");
      return user;
    });
}

function getUserPictureFromId(fintechToken, tenantId, userId) {
  return baseUrl
    .get(`/rest/identity/tenants/${tenantId}/users/${userId}/picture`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect(200)
    .then(result => {
      const picture = result.body;
      return picture;
    });
}

function addPersonalAccountFintech(fintechToken, idempotencyKey, tenantId, ownerId, request) {
  return baseUrl
    .post(`/rest/account/tenants/${tenantId}/personal/${ownerId}/accounts`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    //.expect('Content-Type', /json/)
    //.expect(200)
    .then(result => {
      const account = result.body;
      expect(account).to.be.an('object', "Couldn't get account");
      return account;
    })	
	.catch(tt => console.log("---" + tt));
}

function updatePersonalAccountFintech(fintechToken, tenantId, ownerId, accountId, request) {
  return baseUrl
    .put(`/rest/account/tenants/${tenantId}/personal/${ownerId}/accounts/${accountId}`)
    .send(request)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const account = result.body;
      expect(account).to.be.an('object', "Couldn't get account");
      return account;
    });
}

/* Documents */


// Documents
function createUserDocument(fintechToken, idempotencyKey, tenantId, ownerId, request) {
  return baseUrl
    .post(`/rest/identity/tenants/${tenantId}/users/${ownerId}/documents`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const account = result.body;
      expect(account).to.be.an('object', "Couldn't get account");
      return account;
    });
}

// KYC
function getKycRequiredDocuments(fintechToken, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/kycRequiredDocuments`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${fintechToken}`)
        .expect(200)
        .then(result => {
            const kyc = result.body;
            expect(kyc).to.be.an('object', "Couldn't get kyc required documents");
            return kyc;
        });
      }



function addAccountKYC(fintechToken, idempotencyKey, tenantId, accountType, ownerId, accountId, KycRequest) {
    return baseUrl
        .post(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/kycs`)
        .send(KycRequest)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${fintechToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const kyc = result.body;
            expect(kyc).to.be.an('object', "Couldn't get kyc");
            return kyc;
        });
      };


  function getKycFromId(fintechToken, tenantId, accountType, ownerId, accountId, kycId) {
    console.log(accountType)
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/kycs/${kycId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .set('Authorization', `Bearer ${fintechToken}`)
        //.expect(200)
        .then(result => {
            console.log(result)
            const kyc = result.body;
            expect(kyc).to.be.an('object', "Couldn't get kyc required documents");
            return kyc;
        });
      }


// Enterprise
function createEnterpriseFintech(fintechToken, idempotencyKey, tenantId, enterprisesRequest) {
  return baseUrl
    .post(`/rest/identity/tenants/${tenantId}/enterprises`)
    .send(enterprisesRequest)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .set('Idempotency-Key', idempotencyKey)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const enterprise = result.body;
      expect(enterprise).to.be.an('object', "Couldn't get enterprise");
      return enterprise;
    });
}


function updateEnterpriseFromId(fintechToken, tenantId, enterpriseId, request) {
  return baseUrl
    .put(`/rest/identity/tenants/${tenantId}/enterprises/${enterpriseId}`)
    .send(request)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const enterprise = result.body;
      expect(enterprise).to.be.an('object', "Couldn't get enterprise");
      return enterprise;
    });
}

function getBusinessLogoFromId(fintechToken, tenantId, enterpriseId) {
  return baseUrl
    .get(`/rest/identity/tenants/${tenantId}/enterprises/${enterpriseId}/logo`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect(200)
    .then(result => {
      const picture = result.body;
      return picture;
    });
}

function addBusinessAccountFintech(fintechToken, idempotencyKey, tenantId, ownerId, request) {
  return baseUrl
    .post(`/rest/account/tenants/${tenantId}/business/${ownerId}/accounts`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    //.expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const account = result.body;
      expect(account).to.be.an('object', "Couldn't get account");
      return account;
    });
}

/* Documents */

function createEnterpriseDocument(fintechToken, idempotencyKey, tenantId, ownerId, request) {
  return baseUrl
    .post(`/rest/identity/tenants/${tenantId}/enterprises/${ownerId}/documents`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const account = result.body;
      expect(account).to.be.an('object', "Couldn't get account");
      return account;
    });
}


module.exports = {
    createUserFintech,
    addPersonalAccountFintech,
    updatePersonalAccountFintech,
    getKycRequiredDocuments,
    createUserDocument,
    createEnterpriseDocument,
    addAccountKYC,
    createEnterpriseFintech,
    addBusinessAccountFintech,
    updateUserFromId,
    getUserPictureFromId,
    updateEnterpriseFromId,
    getBusinessLogoFromId,
    getKycFromId
};

