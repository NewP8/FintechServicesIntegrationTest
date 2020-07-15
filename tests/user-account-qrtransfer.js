const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

describe("User: create account and qr request", function() {
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

  /* 
   * User A
   */

	it('should create user', function() {
    const userRequest = {
      telephone: `+00${Math.floor(Math.random() * 10000000000)}`, 
      email: `fabagnale${Math.floor(Math.random() * 1000000)}@fintechplatform.tech`, 
      name: `Frank ${Math.floor(Math.random() * 1000000)}`, 
      surname: `Abagnale ${Math.floor(Math.random() * 1000000)}`, 
      birthday: '1948-04-27', 
      nationality: 'IT', 
      countryOfResidence: 'IT'
    }
		const idemKey = `usera_${Math.random()}`;
		return api.account.createUserFintech(
			state.token,
			idemKey,
			api.core.CLIENT_TENANT_ID,
			userRequest)
		.then (function(user) {
			expect(user).to.include({tenantId: api.core.CLIENT_TENANT_ID})
			expect(user).to.include(userRequest)
			expect(user).to.have.property('created')
			expect(user.created).to.have.lengthOf.at.least(20)
			expect(user).to.have.property('updated')
			expect(user.updated).to.have.lengthOf.at.least(20)
			expect(user).to.have.property('userId')
			expect(user.userId).to.have.lengthOf(36)

			state.userAObject = user
      console.log(`userId A: ${user.userId}`)
		});
	});

  /* 
   * Account User
   */
  it('should create an account for User', function() {		
      const accountIdemKey = `accounta_${Math.random()}`;
      return api.account.addPersonalAccountFintech(
              state.token,
              accountIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.userAObject.userId,
              { 
              	aspName: "MANGOPAY",
              	tags: "MY MASTER"
              })
          .then(function(account) {
            expect(account).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.userAObject.userId,
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

            state.userAAccountObject = account
            console.log(`accountId A: ${account.accountId}`)
        });
    });

  it('should create qr request transfer', function() {
    const req = {
      creditedAccount: {
        tenantId: api.core.CLIENT_TENANT_ID, 
        accountType: "PERSONAL", 
        ownerId: state.userAObject.userId, 
        accountId: state.userAAccountObject.accountId
      },
      amount: {
          amount: 500,
          currency: 'EUR'
        },
      message: "Hello"
    }
    const idemKey = `qrtransfer_${Math.random()}`;
    return api.qrtransfer.addQrCreditTransfer(
      state.token,
      idemKey,
      api.core.CLIENT_TENANT_ID,
      req)
    .then (function(qr) {
      console.log(qr)

      state.qr = qr
      console.log(`qrCreditTransferId A: ${qr.qrCreditTransferId}`)
    });
  });

  it('should update amount of qr request transfer', function() {
    const req = {
      amount: {
          amount: 1500,
          currency: 'EUR'
        }
    }
    return api.qrtransfer.updateQrCreditTransfer(
      state.token,
      api.core.CLIENT_TENANT_ID,
      state.qr.qrCreditTransferId,
      req)
    .then (function(qr) {
      console.log(qr)

      state.qr = qr
      console.log(`qrCreditTransferId A: ${qr.qrCreditTransferId}`)
    });
  });



});

