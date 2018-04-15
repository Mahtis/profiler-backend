const router = require('express').Router()

const profileService = require('../services/profiles')

router.get('/:profileId', async (req, res) => {
  const { profileId } = req.params
  const profile = await profileService.getProfile(profileId)
  res.status(200).json(profile)
})

module.exports = router
