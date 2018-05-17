const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const accountService = require('./accounts')

const { Account } = require('../models/index')

const checkAuth = async (req) => {
  const token = req.headers['x-access-token']
  console.log(token)
  if (!jwt.verify(token, process.env.SECRET)) {
    console.log('NOT AUTHED')
    return null
  }
  const { user } = jwt.decode(token)
  return await accountService.getUser(user)
}

const createToken = async (account) => {
  const token = jwt.sign({ user: account.id }, process.env.SECRET, { expiresIn: '24h' })
  console.log(token)
  console.log(jwt.decode(token))
  return token
}

const logUser = async (username, password) => {
  const user = await Account.findOne({ where: { username } })
  //console.log(user.username)
  if (user === null) return null
  const corr = bcrypt.compareSync(password, user.password)
  console.log(`The password was ${corr}`)
  if (corr) return createToken(user)
  return null
}

module.exports = { checkAuth, createToken, logUser }