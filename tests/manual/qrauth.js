const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');

const state = {
    token: "token"
};

describe("QrAuth", function() {
	this.timeout(10000);
	this.slow(100);	

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

			state.userObject = user
      console.log(`userId: ${user.userId}`)
		});
	});

   /* 
   * qrAuth
   */

	it('create qrAuth token', function() {
		return api.qrauth.setQrAuths(
			state.token,
			api.core.CLIENT_TENANT_ID)
		.then (function(qrAuth) {
			console.log(`qrAuth token: ${qrAuth.qrAuthId}`)
			state.qrAuth = qrAuth
		});
	});

	it('simulate user that scan qrcode', function() {
		return api.qrauth.setQrAuthsToken(
			state.token,
			api.core.CLIENT_TENANT_ID,
			state.qrAuth.qrAuthId,
			state.userObject.userId)
		.then (function(qrAuth) {
			expect(qrAuth).to.include({userId: state.userObject.userId})
			state.qrAuthReply = qrAuth
		});
	});


});

