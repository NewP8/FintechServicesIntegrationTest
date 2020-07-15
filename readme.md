
API Integration Test for Tenants
=================================================

Introduction
-------------------------------------------------
This scripts allow to test the Fintech Platform API and can be used to gain knownledge of how the platform works.

Initialize the environment
-------------------------------------------------
Before use the test scripts you have to initialize the project dependencyies running:
```
npm install
```

and initialize the following Bash environment variables:
* BASE_URL: host name of the Fintech Platform
* CLIENT_TENANT_ID: Client service tenant id
* CLIENT_SECRET: Client secret

To do that you can create an `init_env.sh` file like this:
```
#!/bin/sh
# host name of the Fintech Platform
export BASE_URL=https://api.sandbox.example.com

# Client service tenant id
export CLIENT_TENANT_ID=12345678-1234-1234-1234-123456789012

# Client secret (pair with client id for request token to access the fintech service)
export CLIENT_SECRET=averylongandfullofcharsandnumbersandcrazystuffpassword
```

And run it:
```
. ./init_env.sh
```




Run Tests
-------------------------------------------------
To run a test you can use the `run.sh` script:
```
./run.sh tests/TEST_NAME.js
```

# Tests
Follow the list of tests present in this project:

* `token.js`: create server token and print it
* `user-account.js`: create an user, an account and the user token and print the ids
* `user-account-kyc.js`: create an user, an account and request KYC
* `enterprise-account-kyc.js`: create an enterprise, an account and request KYC
* `user-account-kyc-asp-references`: see "Upgrade user account from light to regular" paragraph
* `user-account-upgrade_to_level_3`: see "Upgrade user account from light to regular" paragraph
* `kyc-for-existing-user`: request KYC for an existing user
* `user-account-qrtransfer`: create an account and a qr request transfer
* `users-accounts-payin_card-p2p-payout_bank`: create accounts for user A and user B, payin user A via card, p2p from user A to user B, payout via bank for user B
* `qrauth`: authenticate through qr code


## Upgrade user account from light to regular
In order to upgrade the user credentials you can use the following script:
```
./run.sh tests/user-account-kyc.js
```
Take note of ``userId``, `accountId`,  `kycId` and run:
```
OWNER_ID='the userId' ACCOUNT_ID='the accountId' ACCOUNT_TYPE='personal' KYC_ID='the kycId' ./run.sh tests/user-account-kyc-asp-references.js 
```

Take note of the kyc references and send an email to our tech support with subject "KYC VALIDATION" and a message that contains the kyc reference.

When our tech support comes back to you, you can upgrade the user status with the script:
```
./run.sh tests/user-account-upgrade_to_level_3.js
```
