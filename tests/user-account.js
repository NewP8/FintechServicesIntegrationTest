const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');

const fs = require('fs');

const state = {
    token: "token",
};

describe("Core", function() {
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


  it('should create token', function() {
    return api.core.createServerToken(
    	api.core.CLIENT_TENANT_ID, 
    	api.core.CLIENT_SECRET, 
    	'client_credentials',
    	['identity', 'account'])
    .then(function(token) { 
      console.log(`tenantId: ${api.core.CLIENT_TENANT_ID}`)
      console.log(`Tenant token: ${token}`)
    	state.token = token
    });
  });
*/

  /* 
   * User
   */
  const userRequest = {
		telephone: `+00${Math.floor(Math.random() * 10000000000)}`, 
		email: `fabagnale${Math.floor(Math.random() * 1000000)}@fintechplatform.tech`, 
		name: `Frank ${Math.floor(Math.random() * 1000000)}`, 
		surname: `Abagnale ${Math.floor(Math.random() * 1000000)}`, 
		birthday: '1948-04-27', 
		nationality: 'IT', 
		countryOfResidence: 'IT'
	}

	it('should create user', function() {
		const idemKey = `user_${Math.random()}`;
		console.log(idemKey + ";" + api.core.CLIENT_TENANT_ID);
		return api.account.createUserFintech(
			state.token,
			idemKey,
			api.core.CLIENT_TENANT_ID,
			userRequest)
		.then (function(user) {
            console.log(user)
			expect(user).to.include({tenantId: api.core.CLIENT_TENANT_ID})
			expect(user).to.include(userRequest)
			expect(user).to.have.property('created')
			expect(user.created).to.have.lengthOf.at.least(20)
			expect(user).to.have.property('updated')
			expect(user.updated).to.have.lengthOf.at.least(20)
			expect(user).to.have.property('userId')
			expect(user.userId).to.have.lengthOf(36)

			state.userObject = user
      console.log(`userId: ${user.userId}`)
		});
	});

  /* 
   * Account 
   */
	const accountIdemKey = `account_${Math.random()}`;
  it('should create an account', function() {
	  console.log(state.token);
      return api.account.addPersonalAccountFintech(
              state.token,
              accountIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.userObject.userId,
              { 
              	aspName: "MANGOPAY",
              	tags: "MY MASTER"
              })
          .then(function(account) {
            console.log("re:" + JSON.stringify(account))
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
            console.log(`accountId: ${account.accountId}`)
            console.log(`accountType: PERSONAL`)
        });
    });

  /*
  it('should create user token', function() {
    return api.core.createUserToken(
      state.token,
      api.core.CLIENT_TENANT_ID,
      state.userObject.userId)
    .then (function(userToken) {

      console.log("aaa:" + JSON.stringify(userToken))
      expect(userToken).to.include({tenantId: api.core.CLIENT_TENANT_ID,
        userId: state.userObject.userId})

      expect(userToken).to.have.property('token')
      state.userToken = userToken
      console.log(`userToken: ${userToken.token}`)
    });
  });
  */


});

