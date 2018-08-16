const router = require('express').Router()

const { checkAuth } = require('../services/auth')
const authService = require('../services/auth')
const accountService = require('../services/accounts')

router.post('/register', async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body
  const account = await accountService.createAccount(username, firstname, lastname, email, password, 'USER')
  if (account) {
    const token = await authService.logUser(username, password)
    res.status(201).json({token, account, msg: 'user account created successfully'})
  } else {
    res.status(400).json({ error: 'sorry, I done goofed up' })
  }
})

router.get('/', async (req, res) => {
  // console.log(req)
  const user = await checkAuth(req)
  if (user) {
    res.status(200).json(user)
    return
  }
  res.status(400).json({error: 'Not so fast buddy'})
})


router.get('/all', async (req, res) => {
  const user = await checkAuth(req)
  if (user) {
    const accounts = await accountService.getAllAccounts()
    res.status(200).json(accounts)
    return
  }
  res.status(400).json({error: 'Not so fast buddy'})
})

module.exports = router