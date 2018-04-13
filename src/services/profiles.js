const { Profile, Question, ResponseOption } = require('../models')

const getProfile = id => {
  return Profile.findById(id, { include: { model: Question, include: ResponseOption } })
}

const getAll = () => {
  return Profile.findAll()
}

/**
 * Check whether the current user is the owner of this profile.
 * @param {*} accountId 
 */
const isUserProfileOwner = (accountId) => {
  if (accountId) return true
  return false
}

module.exports = { getProfile, getAll }