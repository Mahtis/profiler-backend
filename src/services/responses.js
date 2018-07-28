const { Response, Profile, Question, ResponseOption, ProfileQuestion } = require('../models')

const getProfileResponses = async (profile) => {
  return profile.getResponses()
}

// Should this have the question_id as well?
const getResponseAmounts = async (responses) => {
  const amounts = await Promise.all(responses.map(async (resp) => {
    const { profile_id, response_option_id } = resp
    const total = await Response.findAll({where: { profile_id }})
    const amount = total.filter(t => t.response_option_id === response_option_id)
    return {
      profile_id,
      response_option_id,
      total: total.length,
      amount: amount.length }
  }))
  return amounts
}

const getUserResponses = async (account_id) =>  Response.findAll({ where: { account_id } })

/**
 * Calculates response amounts per profile.
 * Returns an object with profile ids as keys and each profile contains
 * how many responses were correct, and total number of responses.
 * @param {Reponse} responses all responses of a user.
 */
const calculateResponsesPerProfile = (responses) => {
  const profiles = {}
  responses.map(response => {
    profileId = response.profile_id
    if (!profiles[profileId]) profiles[profileId] = { total: 0, correct: 0 }
    profiles[profileId].total += 1
    if (response.correct) profiles[profileId].correct += 1
  })
  return profiles
}

/**
 * Get user response options for profile. 
 * Returns empty if the user has not rated the profile yet.
 * @param {*} accountId 
 * @param {*} profileId 
 */
const getUserResponsesForProfile = async (account, profile) => {
  const userResponses = await account.getResponses({include: ResponseOption})
    .then(responses => responses.filter(response => response.profile_id === profile.id))
  if (userResponses.length === 0) {
    return userResponses
  }
  // If user has not responded yet, return empty array
  return userResponses
}

const getResponsesForProfile = async (profile) => {
  const questions = profile.getQuestions()
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
  //console.log(responses)
  return responses
}

const saveResponses = async (accountId, responses, profileId) => {
  const profileQuestions = Object.keys(responses)
  const list = await Promise.all(profileQuestions.map(async pq => {
    const question = await ProfileQuestion.findOne({ where: { profile_id: profileId, question_id: pq } })
    const correct = question.correct_response === responses[pq]
    // console.log(question.correct_response, responses[pq])
    // console.log(`${accountId} -- ${pq} -- ${responses[pq]} -- ${correct}`)
    return Response.create({
      account_id: accountId,
      profile_id: parseInt(profileId),
      response_option_id: parseInt(responses[pq]),
      correct
    })
  }))
  return list
}


/**
 * Calculates the total proportion of correct responses on given profiles.
 * @returns {[{correct, total}]} percentage of correct respones and number of reviews
 * @param {[Profile]} profiles
 */
const getStatsForProfiles = async (profiles) => {
  if (profiles.length) {
    const percentages = await Promise.all(profiles.map(async profile => {
      const questionStats = await getCorrectResponsesForProfile(profile)
      const stat = questionStats.reduce((total, curStat) => total + curStat.correct / curStat.total, 0)
      // relies on the assumption that each question has the same number of responses (which should be true)
      const correct = isNaN(stat) ? 0 : stat / questionStats[0].total * 100
      return { correct, total: questionStats[0].total }
    }))
    return percentages
  }
}

/**
 * Returns array of stats for questions of a profile.
 * .correct contains number of correct responses for this question
 * .total is the total number of responses for question (should be equal for all)
 * .questionId is the questions id
 * @param {Profile} profile 
 */
const getCorrectResponsesForProfile = async (profile) => {
  const responses = await profile.getResponses({ include: ResponseOption })
  const questions = await profile.getQuestions()
  return Promise.all(questions.map(question => {
    const questionResponses = responses.filter(response => response.response_option.question_id === question.id)
    const corrects = questionResponses.filter(response => response.correct)
    return { questionId: question.id, total: questionResponses.length, correct: corrects.length }
  }))
  // const questions = await ProfileQuestion.findAll({ where: { profile_id } })
  // return await Promise.all(questions.map(async question => {
  //   const responses = await Response.findAll({ where: { profile_question_id: question.id }})
  //   const corrects = responses.filter(resp => resp.correct)
  //   return {total: responses.length, correct: corrects.length}
  // }))
}

/**
 * Simply calculate from a set of responses the proportion of corrects.
 * @param {[Response]} responses 
 */
const correctResposePercentage = (responses) => {
  const corrects = responses.filter(response => response.correct).length
  if (corrects === 0) {
   return 0
  }
  return corrects / responses.length * 100
}

/**
 * Compares responses to those of others.
 * Returns the proportion of how many other responded with the same option.
 * { profile_id,
      response_option_id,
      total: total.length,
      amount: amount.length }
 * @param {[Response]} responses 
 */
const calculateResponseAgreement = async (responses) => {
  const amounts = await getResponseAmounts(responses)
  const profiles = {}
  amounts.map(question => {
    if (!profiles[question.profile_id]) {
      profiles[question.profile_id] = {total: 0, agreement: 0}
    }
    profiles[question.profile_id].total += question.total
    profiles[question.profile_id].agreement += question.amount
  })
  return Object.keys(profiles).map(id => {
    return {
      profile_id: id,
      agreement: profiles[id].agreement / profiles[id].total * 100 }
  })
}

module.exports = { 
  getProfileResponses,
  getUserResponsesForProfile,
  getResponsesForProfile,
  getResponseAmounts,
  saveResponses,
  getStatsForProfiles,
  getCorrectResponsesForProfile,
  getUserResponses,
  calculateResponsesPerProfile,
  correctResposePercentage,
  calculateResponseAgreement }
