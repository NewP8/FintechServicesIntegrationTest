const chai = require('chai');
const request = require("supertest");
const { assert, expect } = chai;
chai.should();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseUrlPath = process.env.BASE_URL
const baseUrl = request(baseUrlPath);

function addQrCreditTransfer(token, idempotencyKey, tenantId, req) {
    return baseUrl
        .post(`/rest/v1/account/tenants/${tenantId}/qrCreditTransfers`)
        .send(req)
        .set('Idempotency-Key', idempotencyKey)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(result => {
            const qrtransfer = result.body;
            expect(qrtransfer).to.be.an('object', "Couldn't get qrtransfer");
            return qrtransfer;
        });
}

function updateQrCreditTransfer(token, tenantId, qrCreditTransferId, req) {
     console.log("aaaaaa")
     console.log(qrCreditTransferId)
     console.log(tenantId)
     console.log(JSON.stringify(req))
     return baseUrl
        //.get(`/rest/v1/account/tenants/${tenantId}/qrCreditTransfers/${qrCreditTransferId}`)
        .put(`/rest/v1/account/tenants/${tenantId}/qrCreditTransfers/${qrCreditTransferId}`)
        .send(req)
        .set('Accept', 'application/json')
        //.set('Authorization', `Bearer ${token}`)
        //.expect('Content-Type', /json/)
        //.expect(200)
        .then(result => {
            console.log("rrr" + result);
            const qrtransfer = result;
            expect(qrtransfer).to.be.an('object', "Couldn't get qrtransfer");
            return qrtransfer;
        })
        .catch(z => console.log(z))
        ;
}

module.exports = {
    addQrCreditTransfer,
    updateQrCreditTransfer
}
