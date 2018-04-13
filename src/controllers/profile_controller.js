const router = require('express').Router()

const Profiles = require('../services/profiles')

router.get('/', async (req, res) => {
  console.log('req')
  const profiles = await Profiles.getAll()
  res.status(200).json(profiles)
})

module.exports = router
