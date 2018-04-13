const router = require('express').Router()

const Responses = require('../services/responses')

router.get('/', async (req, res) => {
  //const profile = await Profiles.getProfile(1)
  //console.log(Responses.getResponsesForProfile(1))
  //const pq = profile.questions[0].profile_question
  await Responses.getProfileResponseOptionPercentages(1, [1, 10, 18, 26])
  const responses = await Responses.getResponsesForProfile(1)
  res.status(200).json(responses)
})

module.exports = router
