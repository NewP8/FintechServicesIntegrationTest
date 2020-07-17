const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addAccountLinkedCard(token, idempotencyKey, tenantId, accountType, ownerId, accountId, requestLikedCard) {
    return baseUrl
        .post(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards`)
        .send(requestLikedCard)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('object', "Couldn't get linkedCard");
            return linkedCard;
        });
}

function findAllAccountLinkedCardsFromOwnerId(token, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('array', "Couldn't get linkedCard");
            return linkedCard;
        });
}

function findAccountLinkedCardFromCardId(token, tenantId, accountType, ownerId, accountId, cardId) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${cardId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('object', "Couldn't get linkedCard");
            return linkedCard;
        });
}

function updateAccountLinkedCardTSPRefsFromId(token, tenantId, accountType, ownerId, accountId, cardId, tspRefsRequest) {
    return baseUrl
        .put(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${cardId}`)
        .send(tspRefsRequest)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('object', "Couldn't get linkedCard");
            return linkedCard;
        });
}


function findAllAccountLinkedTestCards(token, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .get(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCardsTestCards`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('array', "Couldn't get linkedCard");
            return linkedCard;
        });
}

function updateLinkedCardDefaultFromCardId(token, tenantId, accountType, ownerId, accountId) {
    return baseUrl
        .put(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${cardId}/default`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const linkedCard = result.body;
            expect(linkedCard).to.be.an('object', "Couldn't get linkedCard");
            return linkedCard;
        });
}

function deleteAccountLinkedCard(token, tenantId, accountType, ownerId, accountId, cardId) {
    return baseUrl
        .delete(`/rest/account/tenants/${tenantId}/${accountType}/${ownerId}/accounts/${accountId}/linkedCards/${cardId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(result => {
            return result.text;
        });
}

function postCardRegistrationData(url, req) {
    return request('')
        .post(url)
        .send(req)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(200)
        .then(result => {
            const tspResp = result.text;
            expect(tspResp).to.be.an('string', "Couldn't get tspResp");
            return tspResp;
        });
}


module.exports = {
    addAccountLinkedCard,
    deleteAccountLinkedCard,
    findAccountLinkedCardFromCardId,
    findAllAccountLinkedCardsFromOwnerId,
    findAllAccountLinkedTestCards,
    updateAccountLinkedCardTSPRefsFromId,
    updateLinkedCardDefaultFromCardId,
    postCardRegistrationData
}
