const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};


if (process.env.OWNER_ID == undefined || process.env.ACCOUNT_ID == undefined) {
  console.log('Error: missing OWNER_ID or ACCOUNT_ID or ACCOUNT_TYPE env vars. You can get this data from user-account-kyc.js')
  console.log('example:$ OWNER_ID=\'...\' ACCOUNT_ID=\'...\' ./run.sh tests/user-account-upgrade_to_level_3.js')
  console.log('Please read \'Upgrade user account from light to regular\' paragraph in README.md for details')
  process.exit()
}

const ownerId = process.env.OWNER_ID
const accountId = process.env.ACCOUNT_ID

describe("Upgrade User Account Level.", function() {
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

  // Account KYC
  it('should update an account to level 3', function() {   
      return api.account.updatePersonalAccountFintech(
              state.token,
              api.core.CLIENT_TENANT_ID,
              ownerId,
              accountId,
              {
                status: 'ENABLED',
                levelStatus: 'REQUEST_UPGRADE_TO_LEVEL3'
              })
          .then(function(account) {
            console.log(account)
/*
            expect(account).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.userObject.userId,
                aspName: 'MANGOPAY',
                status: 'ENABLED',
                levelStatus: 'LEVEL1_CREATED',
                level: 'LEVEL1',
                tags: 'MY MASTER'
            });

            expect(account).to.have.property('accountId')
            expect(account.accountId).to.have.lengthOf(36)

            expect(account).to.not.have.property('primaryAccountId')
            expect(account).to.not.have.property('error')

            expect(account).to.have.property('created')
            expect(account.created).to.have.lengthOf.at.least(20)
            expect(account).to.have.property('updated')
            expect(account.updated).to.have.lengthOf.at.least(20)

            state.userAccountObject = account
            console.log(`accountId: ${account.accountId}`)*/
        });
    });

});

