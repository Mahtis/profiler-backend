const router = require('express').Router()

const profileService = require('../services/profiles')

router.get('/', async (req, res) => {
  const fromProfile = Number(req.query.from)
  const profiles = await profileService.getNProfiles(16, fromProfile)
  res.status(200).json(profiles)
})

router.get('/data', async (req, res) => {
  console.log(req)
  const profile = await profileService.getProfile(1)
  //sendFile(ROOT_PATH + profile.picture)
  res.status(200).json(profile)
})

module.exports = router
