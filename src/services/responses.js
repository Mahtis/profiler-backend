const { Response, Profile, Question, ResponseOption, ProfileQuestion } = require('../models')

const getProfileQuestionResponses = async (profileQuestion) => {
  return profileQuestion.getResponses()
}

const getResponseAmounts = async (responses) => {
  const amounts = await Promise.all(responses.map(async (resp) => {
    const { profile_question_id, response_option_id } = resp
    const total = await Response.findAll({where: { profile_question_id }})
    const amount = total.filter(t => t.response_option_id === response_option_id)
    return { profile_question_id,
      response_option_id,
      total: total.length,
      amount: amount.length }
  }))
  return amounts
}

/**
 * Get user response options for profile. 
 * Returns empty if the user has not rated the profile yet.
 * @param {*} accountId 
 * @param {*} profileId 
 */
const getUserResponsesForProfile = async (account, profileId) => {
  const profileQuestions = await ProfileQuestion.findAll({where: {profile_id: profileId}})
  //console.log(profileQuestions)
  const profileQuestionIds = profileQuestions.map(pq => pq.id)
  //console.log(profileQuestionIds)
  const userResponses = await account.getResponses({where: {profile_question_id: profileQuestionIds}})
  //console.log(userResponses)
  // TODO: find and return the response options of user
  // If user has not responded yet, return empty array
  return userResponses
}

const getResponsesForProfile = async (profileId) => {
  const profile = await Profile.findById(profileId, { include: Question })
  const questions = profile.questions
  const responses = []
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i]
    const r = await question.profile_question.getResponses()
    responses.push({ profileQuestion: question.profile_question.id, responses: r })
  }
  for (let i = 0; i < responses.length; i += 1) {
    const pq = responses[i]
    pq.responses.map((response) => {
      pq[response.response_option_id] === undefined ? 
        pq[response.response_option_id] = 1 :
        pq[response.response_option_id] += 1
    })
  }
  return responses
}

const saveResponses = async (accountId, responses) => {
  const profileQuestions = Object.keys(responses)
  const list = await Promise.all(profileQuestions.map(async pq => {
    console.log(`${accountId} -- ${pq} -- ${responses[pq]}`)
    return Response.create({
      account_id: accountId,
      profile_question_id: parseInt(pq),
      response_option_id: parseInt(responses[pq])
    })
  }))
  return list
}

const getStatsForProfiles = async (profiles) => {
  if (profiles.length) {
    const percentages = await Promise.all(profiles.map(async profile => {
      const questionStats = await getCorrectResponsesForProfile(profile.id)
      const stat = questionStats.reduce((total, curStat) => total + curStat.correct / curStat.total, 0)
      return stat / questionStats.length * 100
    }))
    return percentages
  }
}

const getCorrectResponsesForProfile = async (profile_id) => {
  const questions = await ProfileQuestion.findAll({ where: { profile_id } })
  return await Promise.all(questions.map(async question => {
    const responses = await Response.findAll({ where: { profile_question_id: question.id }})
    const corrects = responses.filter(resp => resp.correct)
    return {total: responses.length, correct: corrects.length}
  }))
}

module.exports = { 
  getProfileQuestionResponses,
  getUserResponsesForProfile,
  getResponsesForProfile,
  getResponseAmounts,
  saveResponses,
  getStatsForProfiles,
  getCorrectResponsesForProfile }
