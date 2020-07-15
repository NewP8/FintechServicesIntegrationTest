const core = require('./api-core')
const account = require('./api-account')
const bucket = require('./api-bucket')
const qrauth = require('./api-units-qrauth')
const cashin = require('./api-cash-in')
const card = require('./api-linked-card')
const transfer = require('./api-transfers')
const qrtransfer = require('./api-qrtransfers')
const bank = require('./api-linked-bank')
const cashout = require('./api-cash-out')

module.exports = {
	core: core,
  account: account,
  bucket: bucket,
  qrauth: qrauth,
  cashin: cashin,
  card: card,
  transfer: transfer,
  qrtransfer: qrtransfer,
  bank: bank,
  cashout: cashout
};

