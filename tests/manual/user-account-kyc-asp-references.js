const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {
    token: "token"
};


if (process.env.OWNER_ID == undefined || process.env.ACCOUNT_ID == undefined || process.env.ACCOUNT_TYPE == undefined || process.env.KYC_ID == undefined) {
  console.log('Error: missing OWNER_ID or ACCOUNT_ID or ACCOUNT_TYPE or KYC_ID env vars. You can get this data from user-account-kyc.js')
  console.log('example:$ OWNER_ID=\'...\' ACCOUNT_ID=\'...\' ACCOUNT_TYPE=\'personal\' KYC_ID=\'...\' ./run.sh tests/user-account-kyc-asp-references.js')
  process.exit()
}

const ownerId = process.env.OWNER_ID
const accountId = process.env.ACCOUNT_ID
const accountType = process.env.ACCOUNT_TYPE
const kycId = process.env.KYC_ID

describe("Get user account ASP references. You can use this kyc reference to request to validate the documents by our tech support.", function() {
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

//  it('should create token', function() {
//    return api.core.createServerToken(
//    	api.core.CLIENT_TENANT_ID,
//    	api.core.CLIENT_SECRET,
//    	'client_credentials',
//    	['identity', 'account'])
//    .then(function(token) {
//      console.log(`tenantId: ${api.core.CLIENT_TENANT_ID}`)
//      console.log(`token: ${token}`)
//    	state.token = token
//    });
//  });

  // Account KYC
  it('should get kyc account', function() {   
      return api.account.getKycFromId(
              state.token,
              api.core.CLIENT_TENANT_ID,
              accountType,
              ownerId,
              accountId,
              kycId)
          .then(function(kyc) {
            console.log(`kyc references: ${kyc.aspRefs} for asp: ${kyc.aspName}`)
            console.log(kyc)
        });
    });

});

