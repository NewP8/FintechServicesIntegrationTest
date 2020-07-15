const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);


// Add user Bucket Object
function addUserBucketObject(fintechToken, idempotencyKey, tenantId, userId, request) {
  return baseUrl
    .post(`/rest/v1/fintech/tenants/${tenantId}/users/${userId}/bucketObjects`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const bucket = result.body;
      expect(bucket).to.be.an('object', "Couldn't get bucket");
      return bucket;
    });
}

// Add enterprise Bucket Object
function addEnterpriseBucketObject(fintechToken, idempotencyKey, tenantId, enterpriseId, request) {
  return baseUrl
    .post(`/rest/v1/fintech/tenants/${tenantId}/enterprises/${enterpriseId}/bucketObjects`)
    .send(request)
    .set('Idempotency-Key', idempotencyKey)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${fintechToken}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(result => {
      const bucket = result.body;
      expect(bucket).to.be.an('object', "Couldn't get bucket");
      return bucket;
    });
}

function addBucketObjectFile(uploadPath, pic) {
  return baseUrl
    .post(uploadPath)
    .send(pic)
    //.set('Accept', 'application/octet-stream')
    .expect(200)
    .then(result => {
      const bucket = result.text;
      return bucket;
    });
}




module.exports = {
    addUserBucketObject,
    addBucketObjectFile,
    addEnterpriseBucketObject
};

