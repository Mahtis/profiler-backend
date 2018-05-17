const router = require('express').Router()

const responseService = require('../services/responses')
const accountService = require('../services/accounts')
const { checkAuth } = require('../services/auth')

router.get('/', async (req, res) => {
  //const profile = await Profiles.getProfile(1)
  //console.log(Responses.getResponsesForProfile(1))
  //const pq = profile.questions[0].profile_question
  const responses = await responseService.getResponsesForProfile(1)
  res.status(200).json(responses)
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
