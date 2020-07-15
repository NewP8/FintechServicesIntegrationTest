const chai = require('chai');
const { assert, expect } = chai;
chai.should();

const api = require('./api/api');
const fs = require('fs');

const state = {};

describe("Enterprise: from enterprise creation to open an account and request KYC", function() {
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
    countryOfResidence: 'IT'
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

  // Enterprise
  it('should create enterprise', function () {
        const idemKey = `enterprise_${Math.random()}`;

        const enterpriseReq = {
          telephone: `+00${Math.floor(Math.random() * 10000000000)}`, 
          email: `info${Math.floor(Math.random() * 1000000)}@fintechplatform.tech`, 
          name: `fintechplatform${Math.floor(Math.random() * 1000000)}`,
          legalRepresentativeId: state.userObject.userId,
          addressOfHeadquarters: '41 Corsham Street',
          countryHeadquarters: 'GB',
          cityOfHeadquarters: 'London',
          enterpriseType: 'BUSINESS'
        }

        return api.account.createEnterpriseFintech(
                state.token,
                idemKey,
                api.core.CLIENT_TENANT_ID,
                enterpriseReq)
            .then(function (enterprise) {
              expect(enterprise).to.include({tenantId: api.core.CLIENT_TENANT_ID})
              expect(enterprise).to.include(enterpriseReq)

              expect(enterprise).to.have.property('created')
              expect(enterprise.created).to.have.lengthOf.at.least(20)
              expect(enterprise).to.have.property('updated')
              expect(enterprise.updated).to.have.lengthOf.at.least(20)
              expect(enterprise).to.have.property('enterpriseId')
              expect(enterprise.enterpriseId).to.have.lengthOf(36)

              state.enterpriseObject = enterprise
              console.log(`enterpriseId: ${enterprise.enterpriseId}`)
            })
    })


  /* 
   * Account 
   */
	const accountIdemKey = `account_${Math.random()}`;
  it('should create an account', function() {		
      return api.account.addBusinessAccountFintech(
              state.token,
              accountIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId,
              { 
              	aspName: "MANGOPAY",
              	tags: "MY MASTER"
              })
          .then(function(account) {
            expect(account).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.enterpriseObject.enterpriseId,
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

            state.enterpriseAccountObject = account
            console.log(`accountId: ${account.accountId}`)
        });
    });

  // Account KYC documents
  it('should get kyc required documents', function() {   
      return api.account.getKycRequiredDocuments(
              state.token,
              api.core.CLIENT_TENANT_ID,
              'business',
              state.enterpriseObject.enterpriseId,
              state.enterpriseAccountObject.accountId)
          .then(function(account) {
            expect(account).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.enterpriseObject.enterpriseId,
                accountId: state.enterpriseAccountObject.accountId,
                accountType: 'BUSINESS'
            });

            expect(account).to.have.property('docType')
            console.log(`accepted document types: ${account.docType}`)
        });
    });


  /* 
   * Documents 
   */

  // Document front page
  it('should add enterprise bucket for front image', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addEnterpriseBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.enterpriseObject.enterpriseId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.enterpriseBucketFrontObject = bucket
        });
    });


  state.frontPic = fs.readFileSync('img/front.jpg')

  it('should post enterprise bucket front image file', function() {
    return api.bucket.addBucketObjectFile(state.enterpriseBucketFrontObject.uploadPath, state.frontPic)
    .then(function(bucket) {
    })
  });

  // Document back page
  it('should add enterprise bucket for back image', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addEnterpriseBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.enterpriseObject.enterpriseId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.enterpriseBucketBackObject = bucket
        });
    });

  state.backPic = fs.readFileSync('img/back.jpg')

  it('should post enterprise bucket back image file', function() {
    return api.bucket.addBucketObjectFile(state.enterpriseBucketBackObject.uploadPath, state.backPic)
    .then(function(bucket) {
    })
  });

  it('should create documents', function() {
    const idemKey = `docs_${Math.random()}`;
    const documentReq = {
      docType: "REGISTRATION_PROOF",
      bucketObjectIdPages:[state.enterpriseBucketFrontObject.objectId, state.enterpriseBucketBackObject.objectId]
    }
    return api.account.createEnterpriseDocument(
      state.token,
      idemKey,
      api.core.CLIENT_TENANT_ID,
      state.enterpriseObject.enterpriseId,
      documentReq)
    .then (function(document) {
      expect(document).to.include({tenantId: api.core.CLIENT_TENANT_ID})
      expect(document).to.have.property('created')
      expect(document.created).to.have.lengthOf.at.least(20)
      expect(document.documentId).to.have.lengthOf(36)
      expect(document).to.include({enterpriseId: state.enterpriseObject.enterpriseId})

      state.enterpriseDocument = document
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
              'business',
              state.enterpriseObject.enterpriseId,
              state.enterpriseAccountObject.accountId,
              {documentId: state.enterpriseDocument.documentId})
          .then(function(kyc) {
            expect(kyc).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                ownerId: state.enterpriseObject.enterpriseId,
                accountId: state.enterpriseAccountObject.accountId,
                accountType: 'BUSINESS',
                documentId: state.enterpriseDocument.documentId,
                status : 'CREATED',
                aspName: state.enterpriseAccountObject.aspName
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

  /* Business Logo Picture */
  it('should add business bucket for business logo picture', function() {   
    const bucketIdemKey = `bucket_${Math.random()}`;
    return api.bucket.addUserBucketObject(
              state.token,
              bucketIdemKey,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId,
              {})
          .then(function(bucket) {
            expect(bucket).to.include({
                tenantId: api.core.CLIENT_TENANT_ID,
                bucketName: `${state.enterpriseObject.enterpriseId}`,
                status: 'CREATED'
            });

            expect(bucket).to.have.property('objectId')
            expect(bucket.objectId).to.have.lengthOf(36)

            expect(bucket).to.have.property('uploadPath')

            expect(bucket).to.have.property('created')
            expect(bucket.created).to.have.lengthOf.at.least(20)
            expect(bucket).to.have.property('updated')
            expect(bucket.updated).to.have.lengthOf.at.least(20)

            state.businessBucketBusinessLogoPictureObject = bucket
        });
    });


  state.businessLogo = fs.readFileSync('img/businessLogo.png')

  it('should post business bucket with business logo picture image file', function() {
    return api.bucket.addBucketObjectFile(state.businessBucketBusinessLogoPictureObject.uploadPath, state.businessLogo)
    .then(function(bucket) {
    })
  });

  it('should update business bucket with business logo picture', function() {   
      return api.account.updateEnterpriseFromId(
              state.token,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId,
              { 
                businessLogo: state.businessBucketBusinessLogoPictureObject.objectId
              })
          .then(function(enterprise) {
            expect(enterprise).to.include(
              {
                tenantId: state.userObject.tenantId,
                enterpriseId: state.enterpriseObject.enterpriseId,
                businessLogo: state.businessBucketBusinessLogoPictureObject.objectId
              })
              state.enterpriseObject = enterprise
        });
    });

  it('should get business logo picture', function() {   
      return api.account.getBusinessLogoFromId(
              state.token,
              api.core.CLIENT_TENANT_ID,
              state.enterpriseObject.enterpriseId)
          .then(function(businessLogo) {
            expect(businessLogo).to.deep.equal(state.businessLogo)
        });
    });

  

});

