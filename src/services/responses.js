const { Response, Profile, Question, ResponseOption } = require('../models')

const getProfileQuestionResponses = async (profileQuestion) => {
  return profileQuestion.getResponses()
}

const getResponseAmounts = async (responses) => {
  const amounts = await Promise.all(responses.map(async (resp) => {
    const { profile_question_id, response_option_id } = resp
    const total = await Response.findAll({where: { profile_question_id }})
    const amount = total.filter(t => parseInt(t.response_option_id) === response_option_id)
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
const getUserResponsesForProfile = async (accountId, profileId) => {
  // TODO: find and return the response options of user
  // If user has not responded yet, return empty array
  return [1, 10, 18, 26]
}

const getResponsesForProfile = async (profileId) => {
  const profile = await Profile.findById(profileId, { include: Question })
  const questions = profile.questions
  const responses = []
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i]
    const r = await getProfileQuestionResponses(question.profile_question)
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
    return Response.build({
      account_id: accountId,
      profile_question_id: parseInt(pq),
      response_option_id: parseInt(responses[pq])
    })
  }))
  return list
}

module.exports = { 
  getProfileQuestionResponses,
  getResponsesForProfile,
  getResponseAmounts,
  saveResponses }
