const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addTransfer(token, idempotencyKey, tenantId, accountType, ownerId, accountId, req) {
    return baseUrl
        .post(`/rest/v1/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/transfers`)
        .send(req)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const transfer = result.body;
            expect(transfer).to.be.an('object', "Couldn't get transfer");
            return transfer;
        });
}

function findTransactionDetailedFromTransactionId(token, tenantId, accountType, ownerId, accountId, transactionId) {
    return baseUrl
        .get(`/rest/v1/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/transactions/${transactionId}/detailed`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const transfer = result.body;
            expect(transfer).to.be.an('object', "Couldn't get transaction");
            return transfer;
        });
}

// balance
function accountBalance(token, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .get(`/rest/v1/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/balance`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const balance = result.body;
            expect(balance).to.be.an('object', "Couldn't get balance");
            return balance;
        });
}


module.exports = {
    addTransfer,
    findTransactionDetailedFromTransactionId,
    accountBalance
}
