const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const hashPassword = password => bcrypt.hashSync(password, SALT_ROUNDS)

module.exports = { hashPassword }

