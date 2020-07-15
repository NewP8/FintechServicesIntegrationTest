set BASE_URL=http://localhost:9000
set CLIENT_TENANT_ID=8f47c998-c1d2-11ea-b3de-0242ac130004
set CLIENT_SECRET=pass
set TENANT_KEY_SECRET=asjkfh87iuy4hjrefdiuhrqkfjneawuih43kqjfnewcd

" run.bat tests/token.js

" OWNER_ID or ACCOUNT_ID or ACCOUNT_TYPE or KYC_ID
set OWNER_ID=f4efe7b6-a5ac-4d5a-8666-a35bbc3b149e
set ACCOUNT_ID=a7dae5a5-20e9-42a2-9779-627927ca9193
set ACCOUNT_TYPE=IDENTITY_CARD
" ,PASSPORT,DRIVING_LICENCE
set KYC_ID=e8acd069-8c49-4bc9-baf5-a47b1316542e

" run.bat tests/user-account-kyc-asp-references.js
.\node_modules\.bin\mocha.cmd %1

"run.bat tests/token.js no era su fintech
run.bat tests/user-account.js
"run.bat tests/user-account-kyc.js
"run.bat tests/enterprise-account-kyc.js
"run.bat tests/user-account-kyc-asp-references
"run.bat tests/user-account-upgrade_to_level_3
"run.bat tests/kyc-for-existing-user
"run.bat tests/user-account-qrtransfer
"run.bat tests/users-accounts-payin_card-p2p-payout_bank
"run.bat tests/qrauth



"*`token.js`: crea server token e lo stampa
"*`user-account.js`: crea un user, un account e l’user token e stampa gli ids
"*`user-account-kyc.js`: crea un user, un account e richiede il KYC
"*`enterprise-account-kyc.js`: crea un enterprise, un account e richiede il KYC
"`user-account-kyc-asp-references`: vedi paragrafo 'Aggiornamento utente da light a regular'
"`user-account-upgrade_to_level_3`: vedi 'Aggiornamento utente da light a regular'
"`kyc-for-existing-user`: richiede KYC per un utente esistente
"`user-account-qrtransfer`: crea un account e un qr request transfer
"`users-accounts-payin_card-p2p-payout_bank`: crea un account per un utente A e un utente B, payin utente A via card, p2p dall’utenteA all’utente B, payout via bank per utente B
"`qrauth`: autentica attraverso qr code
