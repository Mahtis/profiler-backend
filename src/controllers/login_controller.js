const router = require('express').Router()

const authService = require('../services/auth')

router.post('/', async (req, res) => {
  console.log(req.body)
  const token = await authService.logUser(req.body.username, req.body.password)
  if (token) res.status(201).json({ token })
  else res.status(401).json( {msg: 'You motherfucker'} )
})

module.exports = router