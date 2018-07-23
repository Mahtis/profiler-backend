const router = require('express').Router()
const formidable = require('formidable')

const { checkAuth } = require('../services/auth')
const profileService = require('../services/profiles')
const responseService = require('../services/responses')
const pictureService = require('../services/picture_service')

router.get('/:profileId', async (req, res) => {
  const response = {}
  const { profileId } = req.params
  const profile = await profileService.getProfile(profileId)
  response.profile = profile
  const user = await checkAuth(req)
  if (user) {
    if (profile.account_id === user.id) {
      const allResponses = responseService.getResponsesForProfile(profile)
      response.allResponses = allResponses
    }
    const responses = await responseService.getUserResponsesForProfile(user, profile)
    const amounts = await responseService.getResponseAmounts(responses)
    response.correct = responses.filter(response => response.correct).length
    response.amounts = amounts
  }  
  res.status(200).json(response)
})

/**
 * Get user's own profiles with their stats.
 */
router.get('/', async (req, res) =>  {
  const user = await checkAuth(req)
  if (!user) {
    res.status(401).json({msg: 'Please login first.'})
    return
  }
  const profiles = await profileService.getUserProfiles(user.id)
  //console.log(profiles[0])
  const stats = await responseService.getStatsForProfiles(profiles)
  const statProfiles = profiles.map((profile, i) => {
    return { id: profile.id,
      thumbnail: profile.thumbnail,
      active: profile.active,
      correct: stats[i].correct,
      total: stats[i].total }
  })
  //console.log(statProfiles)
  res.status(200).json(statProfiles)
})

router.post('/', async (req, res) => {
  const user = await checkAuth(req)
  const form = new formidable.IncomingForm()
  form.keepExtensions = true
  const profile = { account_id: user.id }
  const profileQuestions = []
  let filePath
  form.parse(req)
  form.on('field', (name, value) => {
    profileQuestions.push({ question_id: name, correct_response: value })
  })
  form.on('file', async (name, file) => {
      filePath = file.path
  })
  form.on('end', async () => {
    profile.profileQuestions = profileQuestions
    const pic = await pictureService.createProfilePictureAndThumbnail(filePath)
    profile.picture = pic.picture
    profile.thumbnail = pic.thumbnail
    profile.active = true
    createdProfile = await profileService.createProfile(profile)
    // console.log(profile)
    
  })
  res.status(200).end()
})

module.exports = router
