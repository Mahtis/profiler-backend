const router = require('express').Router()

const { checkAuth } = require('../services/auth')
const profileService = require('../services/profiles')
const responseService = require('../services/responses')

router.get('/:profileId', async (req, res) => {
  const response = {}
  const { profileId } = req.params
  const profile = await profileService.getProfile(profileId)
  response.profile = profile
  const user = await checkAuth(req)
  if (user) {
    if (profile.account_id === user.id) {
      const allResponses = responseService.getResponsesForProfile(profile.id)
      response.allResponses = allResponses
    }
    const responses = await responseService.getUserResponsesForProfile(user, profile.id)
    const amounts = await responseService.getResponseAmounts(responses)
    response.amounts = amounts
  }  
  res.status(200).json(response)
})

module.exports = router
