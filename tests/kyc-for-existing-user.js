const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

if (process.env.OWNER_ID == undefined || process.env.ACCOUNT_ID == undefined) {
  console.log('Error: missing OWNER_ID or ACCOUNT_ID or ACCOUNT_TYPE or KYC_ID env vars. You can get this data from user-account-kyc.js')
  console.log('example:$ OWNER_ID=\'...\' ACCOUNT_ID=\'...\' ./run.sh tests/kyc-for-existing-user.js')
  process.exit()
}

const ownerId = process.env.OWNER_ID
const accountId = process.env.ACCOUNT_ID


describe("User: from user creation to open an account and request KYC", function() {
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


  // Optional: update user data
  
  it('should update user', function() {
    const idemKey = `user_${Math.random()}`;
    const userRequest = {
      addressOfResidence: 'via dal Software n.1',
      cityOfResidence: 'Udine',
      postalCode: '33100',
      occupation: 'dev',
      incomeRange: '1'
    }
    return api.account.updateUserFromId(
      state.token,
      api.core.CLIENT_TENANT_ID,
      ownerId,
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



  // Document front page
  it('should add user bucket for front image', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addUserBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              ownerId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${ownerId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.userBucketFrontObject = bucket
        });
    });


  state.frontPic = fs.readFileSync('img/front.jpg')

  it('should post user bucket front image file', function() {
    return api.bucket.addBucketObjectFile(state.userBucketFrontObject.uploadPath, state.frontPic)
    .then(function(bucket) {
    })
  });

  // Document back page
  it('should add user bucket for back image', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addUserBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              ownerId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${ownerId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.userBucketBackObject = bucket
        });
    });

  state.backPic = fs.readFileSync('img/back.jpg')

  it('should post user bucket back image file', function() {
    return api.bucket.addBucketObjectFile(state.userBucketBackObject.uploadPath, state.backPic)
    .then(function(bucket) {
    })
  });

  it('should create documents', function() {
    const idemKey = `docs_${Math.random()}`;
    const documentReq = {
      docType: "DRIVING_LICENCE",
      bucketObjectIdPages:[state.userBucketFrontObject.objectId, state.userBucketBackObject.objectId]
    }
    return api.account.createUserDocument(
      state.token,
      idemKey,
      api.core.CLIENT_TENANT_ID,
      ownerId,
      documentReq)
    .then (function(document) {
      expect(document).to.include({tenantId: api.core.CLIENT_TENANT_ID})
      expect(document).to.have.property('created')
      expect(document.created).to.have.lengthOf.at.least(20)
      expect(document.documentId).to.have.lengthOf(36)
      expect(document).to.include({userId: ownerId})

      state.userDocument = document
      console.log(`documentId: ${document.documentId}`)
    });
  })


  it('should request kyc', function() {   
    const idemKey = `kyc_${Math.random()}`;
      return api.account.addAccountKYC(
              state.token,
              idemKey,
              api.core.CLIENT_TENANT_ID,
              'personal',
              ownerId,
              accountId,
              {documentId: state.userDocument.documentId})
          .then(function(kyc) {
            expect(kyc).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: ownerId,
                accountId: accountId,
                accountType: 'PERSONAL',
                documentId: state.userDocument.documentId,
                status : 'CREATED'
            });

            expect(kyc).to.have.property('kycId')
            expect(kyc.kycId).to.have.lengthOf(36)

            expect(kyc).to.not.have.property('error')

            expect(kyc).to.have.property('created')
            expect(kyc.created).to.have.lengthOf.at.least(20)
            expect(kyc).to.have.property('updated')
            expect(kyc.updated).to.have.lengthOf.at.least(20)

            console.log(`kycId: ${kyc.kycId}`)
        });
    });

});

