# create a bash script named integration_test.sh that runs the following scripts:
#
# user-account.js
# user-account-kyc.js
# enterprise-account-kyc.js
# user-account-qrtransfer.js
# users-accounts-payin_card-p2p-payout_bank.js

for i in $( ls tests/*.js ); do
  # echo Testing $i
  ./node_modules/mocha/bin/mocha $i
done