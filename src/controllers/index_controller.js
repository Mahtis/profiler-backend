const router = require('express').Router()

const Profiles = require('../services/profiles')

router.get('/data', async (req, res) => {
  console.log(req)
  const profile = await Profiles.getProfile(1)
  //sendFile(ROOT_PATH + profile.picture)
  res.status(200).json(profile)
})

module.exports = router
