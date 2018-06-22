const router = require('express').Router()

const { checkAuth } = require('../services/auth')

router.get('/', async (req, res) => {
  // console.log(req)
  const user = await checkAuth(req)
  if (user) {
    res.status(200).json(user)
    return
  }
  res.status(400).json({error: 'Not so fast buddy'})
  
})

module.exports = router