const router = require('express').Router()

const responseService = require('../services/responses')
const accountService = require('../services/accounts')
const profileService = require('../services/profiles')
const { checkAuth } = require('../services/auth')

/**
 * Get user's response stats.
 */
router.get('/', async (req, res) => {
  const user = await checkAuth(req)
  if (!user) {
    res.status(401).json({ msg: 'cmon mate!' })
  }
  const responses = await responseService.getUserResponses(user.id)
  const responseAmounts = responseService.calculateResponsesPerProfile(responses)
  const thumbnails = await profileService.getThumbnails(Object.keys(responseAmounts))
  const profiles = Object.keys(responseAmounts).map(key => {
    return {
      profileId: key,
      total: responseAmounts[key].total,
      correct: responseAmounts[key].correct,
      thumbnail: thumbnails.find(profile => profile.id===key).thumbnail
    }
  })
  //const profile = await Profiles.getProfile(1)
  //const pq = profile.questions[0].profile_question
  //const responses = await responseService.getResponsesForProfile(1)
  res.status(200).json(profiles)
})

router.post('/', async (req, res) => {
  const user = await checkAuth(req)
  if (!user) {
    res.status(401).end()
    return
  }
  const accountId = user.id
  const responses = await responseService.saveResponses(accountId, req.body)
  const amounts = await responseService.getResponseAmounts(responses)
  console.log(responses)
  res.status(201).json({ amounts })
})

module.exports = router
