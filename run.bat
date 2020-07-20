echo off
set BASE_URL=http://localhost:9000
set CLIENT_TENANT_ID=8f47c998-c1d2-11ea-b3de-0242ac130004
set CLIENT_SECRET=pass
set TENANT_KEY_SECRET=asjkfh87iuy4hjrefdiuhrqkfjneawuih43kqjfnewcd
set OWNER_ID=f4efe7b6-a5ac-4d5a-8666-a35bbc3b149e
set ACCOUNT_ID=a7dae5a5-20e9-42a2-9779-627927ca9193
set ACCOUNT_TYPE=personal
set KYC_ID=e8acd069-8c49-4bc9-baf5-a47b1316542e

.\node_modules\.bin\mocha.cmd %1