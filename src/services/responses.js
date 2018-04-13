const { Response, Profile, Question, ResponseOption } = require('../models')

const getProfileQuestionResponses = async (profileQuestion) => {
  return profileQuestion.getResponses()
}

const getProfileResponseOptionPercentages = async (profileId, responseOptions) => {
  /*const profile = await Profile.findById(profileId, { include: Question })
  //const responses = await Promise.all(profile.questions.map(async question => {
  //  const r = await getProfileQuestionResponses(question.profile_question) 
  //  return { responses: r }
  //}))*/
  const resp = await Response.findAll({
    where: {
      response_option_id: responseOptions,
      profile_question_id: [1, 2, 3, 4, 5, 6] 
    } 
  })  
  console.log(resp.length)
  
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

module.exports = { 
  getProfileQuestionResponses,
  getResponsesForProfile,
  getProfileResponseOptionPercentages }
