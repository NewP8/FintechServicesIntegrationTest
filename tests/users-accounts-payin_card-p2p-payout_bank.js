const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

describe("User: create accounts for user A and user B, payin user A via card, p2p from user A to user B, payout via bank for user B", function() {
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

  /* 
   * User A
   */

	it('should create user A', function() {
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
   * Account User A
   */
  it('should create an account for User A', function() {		
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

  /* 
   * User B
   */

  it('should create user B', function() {
    const userRequest = {
      telephone: `+00${Math.floor(Math.random() * 10000000000)}`, 
      email: `fabagnale${Math.floor(Math.random() * 1000000)}@fintechplatform.tech`, 
      name: `Frank ${Math.floor(Math.random() * 1000000)}`, 
      surname: `Abagnale ${Math.floor(Math.random() * 1000000)}`, 
      birthday: '1948-04-27', 
      nationality: 'IT', 
      countryOfResidence: 'IT',
      postalCode: '33031', // required for linked bank 
      addressOfResidence: 'via Arno n.33', // required for linked bank 
      cityOfResidence: 'Udine' // required for linked bank 
    }
    const idemKey = `userb_${Math.random()}`;
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

      state.userBObject = user
      console.log(`userId B: ${user.userId}`)
    });
  });

  /* 
   * Account User B
   */
  it('should create an account for User B', function() {    
    const accountIdemKey = `accountb_${Math.random()}`;
    return api.account.addPersonalAccountFintech(
          state.token,
          accountIdemKey,
          api.core.CLIENT_TENANT_ID,
          state.userBObject.userId,
          { 
            aspName: "MANGOPAY",
            tags: "MY MASTER"
          })
      .then(function(account) {
        expect(account).to.include({
            tenantId: api.core.CLIENT_TENANT_ID,
            ownerId: state.userBObject.userId,
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

        state.userBAccountObject = account
        console.log(`accountId B: ${account.accountId}`)
    });
  });

  /*
  * Register card for user A
  */

  it('should create Linked Card for User A', function() {
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
            state.userAObject.userId,
            state.userAAccountObject.accountId,
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
          state.userALinkedCard = card
          console.log(`Linked Card id A: ${card.cardId} with status: ${card.status}`)
        });
  });

  it('should get account Linked Card for Testing for User A', function() {
      return api.card.findAllAccountLinkedTestCards(
              state.token,
              api.core.CLIENT_TENANT_ID,
              'personal',
              state.userAAccountObject.ownerId,
              state.userAAccountObject.accountId
          )
          .then(function(testCard) {
              expect(testCard[0]).to.have.property('cardNumber')
              expect(testCard[0]).to.have.property('expiration')
              expect(testCard[0]).to.have.property('cxv')

              console.log('Test Card A')
              console.log(testCard[0])

              state.testCardA = testCard[0]
          })
  });

  it('should post Card Registration Data for User A', function() {
      const tspPayload = JSON.parse(state.userALinkedCard.tspPayload)

      return api.card.postCardRegistrationData(
              tspPayload.url,
              {
                data: tspPayload.preregistrationData,
                accessKeyRef: tspPayload.accessKey,
                cardNumber: state.testCardA.cardNumber,
                cardExpirationDate: state.testCardA.expiration,
                cardCvx: state.testCardA.cxv
              })
          .then(function(tspResp) {
              state.userALinkedCardTspResp = tspResp
          })
  });

  it('should Update the Linked Card with TSP refs', function() {
      var tspPayload = JSON.parse(state.userALinkedCard.tspPayload)
      tspPayload.registration = state.userALinkedCardTspResp

      return api.card.updateAccountLinkedCardTSPRefsFromId(
          state.token,
          api.core.CLIENT_TENANT_ID,
          'personal',
          state.userAAccountObject.ownerId,
          state.userAAccountObject.accountId,
          state.userALinkedCard.cardId, {
              tspPayload: JSON.stringify(tspPayload)
          }).then(function(card) {
            expect(card).to.include({status: 'CREATED'})
            console.log(`Linked Card id A: ${card.cardId} with status: ${card.status}`)
            state.userALinkedCard = card
      });
  });

  /* Pay In */
  it('should Create a Cash In of 5 EUR', function() {
      const idempotencyCashIn = `cashIn_${Math.random()}`
      const cashInReq = {
      amount: {
          amount: 500,
          currency: 'EUR'
        }
      }
      return api.cashin.addLinkedCardCashIn(
        state.token,
        idempotencyCashIn,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userAAccountObject.ownerId,
        state.userAAccountObject.accountId,
        state.userALinkedCard.cardId,
        cashInReq
    )
    .then(function(cashIn) {
        console.log(`CashIn transactionId A: ${cashIn.transactionId}`)
        expect(cashIn).to.deep.include({
            tenantId: api.core.CLIENT_TENANT_ID,
            ownerId: state.userAAccountObject.ownerId,
            accountId: state.userAAccountObject.accountId,
            cardId: state.userALinkedCard.cardId,
            amount: {
                amount: 500,
                currency: 'EUR'
            },
            status: 'SUCCEEDED',
            secure3D: false
        })

        expect(cashIn).to.deep.have.property('transactionId')
        expect(cashIn.transactionId).to.have.lengthOf(36)
        expect(cashIn).to.not.have.property('error')
        expect(cashIn).to.deep.have.property('created')
        expect(cashIn.created).to.have.lengthOf.at.least(20)
        expect(cashIn).to.deep.have.property('updated')
        expect(cashIn.updated).to.have.lengthOf.at.least(20)

        state.cashInA1 = cashIn
    })
  })

  /* P2P */
  it('should transfer 2€ from User A to User B', function() {
      const idempotencyTransfer = `transfer_${Math.random()}`
      const req = {
                  creditedAccount: {
                    tenantId: state.userBAccountObject.tenantId, 
                    accountType: 'personal', 
                    ownerId: state.userBAccountObject.ownerId, 
                    accountId: state.userBAccountObject.accountId
                  },
                  amount: {
                    amount: 200,
                    currency: 'EUR'
                  },
                  message: "Send 2€, enjoy"}
      return api.transfer.addTransfer(
        state.token,
        idempotencyTransfer,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userAAccountObject.ownerId,
        state.userAAccountObject.accountId,
        req
    )
    .then(function(transfer) {
      console.log(`Transfer transactionId A to B: ${transfer.transactionId}`)
        expect(transfer).to.deep.include({
            tenantId: api.core.CLIENT_TENANT_ID,
            ownerId: state.userAAccountObject.ownerId,
            accountId: state.userAAccountObject.accountId,
            creditedAccount: {
              tenantId: state.userBAccountObject.tenantId, 
              accountType: 'PERSONAL', 
              ownerId: state.userBAccountObject.ownerId, 
              accountId: state.userBAccountObject.accountId
            },
            amount: {
                amount: 200,
                currency: 'EUR'
            },
            message: 'Send 2€, enjoy',
            status: 'SUCCEEDED',
        })

        expect(transfer).to.deep.have.property('transactionId')
        expect(transfer.transactionId).to.have.lengthOf(36)
        expect(transfer).to.not.have.property('error')
        expect(transfer).to.deep.have.property('created')
        expect(transfer.created).to.have.lengthOf.at.least(20)
        expect(transfer).to.deep.have.property('updated')
        expect(transfer.updated).to.have.lengthOf.at.least(20)

        state.trasnferAtoB = transfer
    })
  })

  // find transaction
  it('should get the transaction details', function() {
      return api.transfer.findTransactionDetailedFromTransactionId(
        state.token,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userAAccountObject.ownerId,
        state.userAAccountObject.accountId,
        state.trasnferAtoB.transactionId
    )
    .then(function(transfer) {
      console.log(transfer)
    })
  })

  /* Bank Account */
  it('should create Linked Bank for User B', function() {
    const bankIdemKey = `bank_${Math.random()}`;
    return api.bank.addAccountLinkedBank(
            state.token,
            bankIdemKey,
            api.core.CLIENT_TENANT_ID,
            'personal',
            state.userBObject.userId,
            state.userBAccountObject.accountId,
            {
              iban: 'GB95REVO00997017266985'
            }
        )
        .then(function(bank) {
          expect(bank).to.include({status: 'CREATED'})
          expect(bank).to.have.property('bankId')
          expect(bank.bankId).to.have.lengthOf(36)
          expect(bank).to.have.property('created')
          expect(bank.created).to.have.lengthOf.at.least(20)
          expect(bank).to.have.property('updated')
          expect(bank.updated).to.have.lengthOf.at.least(20)
          state.userBLinkedBank = bank
          console.log(`Linked Bank id B: ${bank.bankId} with status: ${bank.status}`)
        });
  });


  /* Payout */
  it('should Create a Cash Out of 1 EUR for User B', function() {
      const idempotencyCashIn = `cashOut_${Math.random()}`
      const cashOutReq = {
      amount: {
          amount: 100,
          currency: 'EUR'
        }
      }
      return api.cashout.addLinkedBankCashOut(
        state.token,
        idempotencyCashIn,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userBAccountObject.ownerId,
        state.userBAccountObject.accountId,
        state.userBLinkedBank.bankId,
        cashOutReq
    )
    .then(function(cashOut) {
        console.log(`CashOut transactionId B: ${cashOut.transactionId}`)
        expect(cashOut).to.deep.include({
            tenantId: api.core.CLIENT_TENANT_ID,
            ownerId: state.userBAccountObject.ownerId,
            accountId: state.userBAccountObject.accountId,
            bankId: state.userBLinkedBank.bankId,
            amount: {
                amount: 100,
                currency: 'EUR'
            },
            status: 'CREATED',
        })

        expect(cashOut).to.deep.have.property('transactionId')
        expect(cashOut.transactionId).to.have.lengthOf(36)
        expect(cashOut).to.not.have.property('error')
        expect(cashOut).to.deep.have.property('created')
        expect(cashOut.created).to.have.lengthOf.at.least(20)
        expect(cashOut).to.deep.have.property('updated')
        expect(cashOut.updated).to.have.lengthOf.at.least(20)

        state.cashOutB1 = cashOut
    })
  });


  // balance

  it('should get the balance of User A', function() {
      return api.transfer.accountBalance(
        state.token,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userAAccountObject.ownerId,
        state.userAAccountObject.accountId
    )
    .then(function(balance) {
      console.log('Balance User A')
      console.log(balance)
    })
  });

  it('should get the balance of User B', function() {
      return api.transfer.accountBalance(
        state.token,
        api.core.CLIENT_TENANT_ID,
        'personal',
        state.userBAccountObject.ownerId,
        state.userBAccountObject.accountId
    )
    .then(function(balance) {
      console.log('Balance User B')
      console.log(balance)
    })
  });


});

