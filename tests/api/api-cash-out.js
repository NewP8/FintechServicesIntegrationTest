const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addLinkedBankCashOut(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedBankId, cashOutRequest) {
    return baseUrl
        .post(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks/${linkedBankId}/cashOuts`)
        .send(cashOutRequest)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const cashOut = result.body;
            expect(cashOut).to.be.an('object', "Couldn't get cashOut");
            return cashOut;
        });
}

function findAllLinkedBankCashOutFromBankId(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedBankId, offset, limit) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks/${linkedBankId}/cashOuts?offset=${offset}&limit=${limit}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)   
        .expect(200)
        .then(result => {
            const cashOut = result.body;
            expect(cashOut).to.be.an('array', "Couldn't get cashOut");
            return cashOut;
        });
}

function findLinkedBankCashOutFromTransactionId(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedBankId, transactionId) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks/${linkedBankId}/cashOuts/${transactionId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const cashOut = result.body;
            expect(cashOut).to.be.an('object', "Couldn't get cashOut");
            return cashOut;
        });
}

function getLinkedBankCashOutFee(token, idempotencyKey, tenantId, accountType, ownerId, accountId, linkedBankId, amount, currency) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedBanks/${linkedBankId}/cashOutsFee?amount=${amount}&currency=${currency}`)
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
    addLinkedBankCashOut,
    findAllLinkedBankCashOutFromBankId,
    findLinkedBankCashOutFromTransactionId,
    getLinkedBankCashOutFee
}
