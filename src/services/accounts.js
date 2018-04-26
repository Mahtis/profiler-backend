const { Account } = require('../models/index')

const getUser = async () => {
  return Account.findAll()
}

module.exports = { getUser }