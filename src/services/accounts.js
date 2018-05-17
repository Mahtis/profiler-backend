const { Account } = require('../models/index')

const getUser = async (id) => {
  return Account.findById(id)
}

module.exports = { getUser }