const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

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

  /* 
   * User
   */

	it('should create user', function() {
		const idemKey = `user_${Math.random()}`;
    const userRequest = {
      telephone: `+00${Math.floor(Math.random() * 10000000000)}`, 
      email: `fabagnale${Math.floor(Math.random() * 1000000)}@fintechplatform.tech`, 
      name: `Frank ${Math.floor(Math.random() * 1000000)}`, 
      surname: `Abagnale ${Math.floor(Math.random() * 1000000)}`, 
      birthday: '1948-04-27', 
      nationality: 'IT', 
      countryOfResidence: 'IT',
      addressOfResidence: 'via dal Software n.1',
      cityOfResidence: 'Udine',
      postalCode: '33100',
      occupation: 'dev',
      incomeRange: '1'
    }
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
        });
    });

  // Account KYC documents
  it('should get kyc required documents', function() {   
      return api.account.getKycRequiredDocuments(
              state.token,
              api.core.CLIENT_TENANT_ID,
              'personal',
              state.userObject.userId,
              state.userAccountObject.accountId)
          .then(function(account) {
            expect(account).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.userObject.userId,
                accountId: state.userAccountObject.accountId,
                accountType: 'PERSONAL'
            });

            expect(account).to.have.property('docType')
            console.log(`accepted document types: ${account.docType}`)
        });
    });


  /* 
   * Documents 
   */

  // Document front page
  it('should add user bucket for front image', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addUserBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.userObject.userId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.userObject.userId}`,
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
              state.userObject.userId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.userObject.userId}`,
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
      docType: "IDENTITY_CARD",
      bucketObjectIdPages:[state.userBucketFrontObject.objectId, state.userBucketBackObject.objectId]
    }
    return api.account.createUserDocument(
      state.token,
      idemKey,
      api.core.CLIENT_TENANT_ID,
      state.userObject.userId,
      documentReq)
    .then (function(document) {
      expect(document).to.include({tenantId: api.core.CLIENT_TENANT_ID})
      expect(document).to.have.property('created')
      expect(document.created).to.have.lengthOf.at.least(20)
      expect(document.documentId).to.have.lengthOf(36)
      expect(document).to.include({userId: state.userObject.userId})

      state.userDocument = document
      console.log(`documentId: ${document.documentId}`)
    });
  })

  /* KYC */
  it('should request kyc', function() {   
    const idemKey = `kyc_${Math.random()}`;
      return api.account.addAccountKYC(
              state.token,
              idemKey,
              api.core.CLIENT_TENANT_ID,
              'personal',
              state.userObject.userId,
              state.userAccountObject.accountId,
              {documentId: state.userDocument.documentId})
          .then(function(kyc) {
            expect(kyc).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.userObject.userId,
                accountId: state.userAccountObject.accountId,
                accountType: 'PERSONAL',
                documentId: state.userDocument.documentId,
                status : 'CREATED',
                aspName: state.userAccountObject.aspName
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

  /* User Picture */
  it('should add user bucket for user picture', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addUserBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.userObject.userId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.userObject.userId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.userBucketUserPictureObject = bucket
        });
    });


  state.selfie = fs.readFileSync('img/selfie.jpg')

  it('should post user bucket user picture image file', function() {
    return api.bucket.addBucketObjectFile(state.userBucketUserPictureObject.uploadPath, state.selfie)
    .then(function(bucket) {
    })
  });

  it('should update user with the user picture', function() {   
      return api.account.updateUserFromId(
              state.token,
              api.core.CLIENT_TENANT_ID,
              state.userObject.userId,
              { 
                picture: state.userBucketUserPictureObject.objectId
              })
          .then(function(user) {
            expect(user).to.include(
              {
                tenantId: state.userObject.tenantId,
                userId: state.userObject.userId,
                picture: state.userBucketUserPictureObject.objectId
              })
              state.userObject = user
        });
    });

  it('should get user user picture', function() {   
      return api.account.getUserPictureFromId(
              state.token,
              api.core.CLIENT_TENANT_ID,
              state.userObject.userId)
          .then(function(userPicture) {
            expect(userPicture).to.deep.equal(state.selfie)
        });
    });

});

