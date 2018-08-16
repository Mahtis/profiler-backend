const { Account } = require('../models/index')
const { hashPassword } = require('../util')

const getUser = id => Account.findById(id)

const getAllAccounts = () => Account.findAll()

const createAccount = (username, firstname, lastname, email, password, role='USER') => {
  const hashedPassword = hashPassword(password)
  return Account.create({ username, firstname, lastname, email, password: hashedPassword, role })
}

module.exports = { getUser, createAccount, getAllAccounts }