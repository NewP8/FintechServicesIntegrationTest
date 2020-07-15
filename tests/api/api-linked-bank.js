const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addAccountLinkedBank(token, idempotencyKey, tenantId, accountType, ownerId, accountId, requestLikedBank) {
    return baseUrl
        .post(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks`)
        .send(requestLikedBank)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedBanks = result.body;
            expect(linkedBanks).to.be.an('object', "Couldn't get linkedBanks");
            return linkedBanks;
        });
}

function findAllAccountLinkedBanksFromOwnerId(token, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .get(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedBanks = result.body;
            expect(linkedBanks).to.be.an('array', "Couldn't get linkedBanks");
            return linkedBanks;
        });
}

function findAccountLinkedBankFromBankId(token, tenantId, accountType, ownerId, accountId, bankId) {
    return baseUrl
        .get(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks/${bankId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedBank = result.body;
            expect(linkedBank).to.be.an('object', "Couldn't get linkedBank");
            return linkedBank;
        });
}



module.exports = {
    addAccountLinkedBank,
    findAllAccountLinkedBanksFromOwnerId,
    findAccountLinkedBankFromBankId
}
