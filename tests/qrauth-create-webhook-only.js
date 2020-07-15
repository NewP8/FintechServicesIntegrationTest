const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

describe("Qr Auth WebHook Only", function() {
	this.timeout(60000);
	this.slow(500);

	state.passed = true;

	afterEach(function() {
		state.passed = state.passed &&
		(this.currentTest.state === "passed");
	});

	beforeEach(function() {
		if (!state.passed) {
			server.close();
			return this.currentTest.skip();
		}
	});

  /* 
   * Token 
   */

  it('should create token', function() {
    return api.core.createServerToken(
    	api.core.CLIENT_TENANT_ID, 
    	api.core.CLIENT_SECRET, 
    	'client_credentials',
    	['identity', 'account'])
    .then(function(token) { 
      console.log(`tenantId: ${api.core.CLIENT_TENANT_ID}`)
      console.log(`token: ${token}`)
    	state.token = token
    });
  });

  
	it('should create webhook', function() {
	 	const idemKey = `webhook_${Math.random()}`;
	 	const webhookRequest = {eventType: 'QRAUTH_AUTHENTICATED', url: 'http://localhost:9002/qrauth' }
	 	return api.core.addWebHook(state.token, api.core.CLIENT_TENANT_ID, idemKey, webhookRequest)
	 	.then (function(webHook) {
	 		state.webHook = webHook;
	 		console.log(state.webHook)
	 	})
	 });

});

