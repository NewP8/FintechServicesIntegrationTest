const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');

const fs = require('fs');

const state = {};

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
   */

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
   * Account 
   */
	const accountIdemKey = `account_${Math.random()}`;
  it('should create an account', function() {		
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
  * Register card for user A
  */

  it('should create Linked Card', function() {
    const cardIdemKey = `card_${Math.random()}`;
    const alias = "402360**********"
    const exp = "1220"
    const cardReq = {
        alias: alias,
        expiration: exp,
        currency: 'EUR'
    };
    return api.card.addAccountLinkedCard(
            state.token,
            cardIdemKey,
            api.core.CLIENT_TENANT_ID,
            'personal',
            state.userObject.userId,
            state.userAccountObject.accountId,
            cardReq
        )
        .then(function(card) {
          expect(card).to.include({status: 'NOT_ACTIVE'})
          expect(card).to.have.property('tspName')
          expect(card).to.have.property('tspPayload')
          expect(card).to.have.property('cardId')
          expect(card.cardId).to.have.lengthOf(36)
          expect(card).to.have.property('created')
          expect(card.created).to.have.lengthOf.at.least(20)
          expect(card).to.have.property('updated')
          expect(card.updated).to.have.lengthOf.at.least(20)
          state.userLinkedCard = card
          console.log(`Linked Card id: ${card.cardId} with status: ${card.status}`)
        });
  });

  it('should get account Linked Card for Testing', function() {
      return api.card.findAllAccountLinkedTestCards(
              state.token,
              api.core.CLIENT_TENANT_ID,
              'personal',
              state.userAccountObject.ownerId,
              state.userAccountObject.accountId
          )
          .then(function(testCard) {
              expect(testCard[0]).to.have.property('cardNumber')
              expect(testCard[0]).to.have.property('expiration')
              expect(testCard[0]).to.have.property('cxv')

              state.testCard = testCard[0]
          })
  });

  it('should post Card Registration Data', function() {
      const tspPayload = JSON.parse(state.userLinkedCard.tspPayload)

      return api.card.postCardRegistrationData(
              tspPayload.url,
              {
                data: tspPayload.preregistrationData,
                accessKeyRef: tspPayload.accessKey,
                cardNumber: state.testCard.cardNumber,
                cardExpirationDate: state.testCard.expiration,
                cardCvx: state.testCard.cxv
              })
          .then(function(tspResp) {
              state.userLinkedCardTspResp = tspResp
          })
  });

  it('should Update the Linked Card with TSP refs', function() {
      var tspPayload = JSON.parse(state.userLinkedCard.tspPayload)
      tspPayload.registration = state.userLinkedCardTspResp

      return api.card.updateAccountLinkedCardTSPRefsFromId(
          state.token,
          api.core.CLIENT_TENANT_ID,
          'personal',
          state.userAccountObject.ownerId,
          state.userAccountObject.accountId,
          state.userLinkedCard.cardId, {
              tspPayload: JSON.stringify(tspPayload)
          }).then(function(card) {
            expect(card).to.include({status: 'CREATED'})
            console.log(`Linked Card id: ${card.cardId} with status: ${card.status}`)
            state.userLinkedCard = card
      });
  });


  it('should create user token', function() {
    return api.core.createUserToken(
      state.token,
      api.core.CLIENT_TENANT_ID,
      state.userObject.userId)
    .then (function(userToken) {
      expect(userToken).to.include({tenantId: api.core.CLIENT_TENANT_ID,
        userId: state.userObject.userId})

      expect(userToken).to.have.property('token')
      state.userToken = userToken
      console.log(`userToken: ${userToken.token}`)
    });
  });


});

