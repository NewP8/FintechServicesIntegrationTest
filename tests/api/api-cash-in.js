const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addLinkedCardCashIn(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedCardId, cashInRequest) {
    return baseUrl
        .post(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${linkedCardId}/cashIns`)
        .send(cashInRequest)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const cashIn = result.body;
            expect(cashIn).to.be.an('object', "Couldn't get cashIn");
            return cashIn;
        });
}

function findAllLinkedCardCashInFromCardId(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedCardId, offset, limit) {
    return baseUrl
        .get(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${linkedCardId}/cashIns?offset=${offset}&limit=${limit}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)   
        .expect(200)
        .then(result => {
            const cashIn = result.body;
            expect(cashIn).to.be.an('array', "Couldn't get cashIn");
            return cashIn;
        });
}

function findLinkedCardCashInFromTransactionId(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedCardId, transactionId) {
    return baseUrl
        .get(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${linkedCardId}/cashIns/${transactionId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const cashIn = result.body;
            expect(cashIn).to.be.an('object', "Couldn't get cashIn");
            return cashIn;
        });
}

function getLinkedCardCashInFee(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedCardId, amount, currency) {
    return baseUrl
        .get(`/rest/v1/fintech/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${linkedCardId}/cashInsFee?amount=${amount}&currency=${currency}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .then(result => {
            const money = result.body;
            expect(money).to.be.an('object', "Couldn't get Fee");
            return money;
        });
}


module.exports = {
    addLinkedCardCashIn,
    findAllLinkedCardCashInFromCardId,
    findLinkedCardCashInFromTransactionId,
    getLinkedCardCashInFee
}
