const { Op } = require('sequelize')
const { Profile, Question, ProfileQuestion, ResponseOption } = require('../models')

const getProfile = async id => {
  return Profile.findById(id, { include: { model: Question, include: ResponseOption } })
}

const getProfiles = async ids => {
  return Profile.find({ where: { id: ids }})
}

const getNProfiles = async (n, fromId = null) => {
  if (fromId) {
    return Profile.find({ where: { id: { [Op.lt]: fromId } }, order: [['id', 'DESC']], limit: n }) 
  }
  return Profile.findAll({ order: [['id', 'DESC']], limit: n }) 
}

const getAll = async () => {
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

const getUserProfiles = async (account_id) => Profile.findAll({ where: { account_id }, include: [Question] })

const getThumbnails = async (profiles) => Profile.findAll({ where: {id: profiles}, attributes: ['id', 'thumbnail'] })

const createProfile = async (profile) => {
  const createdProfile = await Profile.create(profile)
  const { profileQuestions } = profile
  profileQuestions.map(pq => pq.profile_id = createdProfile.id)
  await ProfileQuestion.bulkCreate(profileQuestions)
  return getProfile(createdProfile.id)
}

module.exports = {
  getProfile,
  getAll,
  getProfiles,
  getNProfiles,
  getUserProfiles,
  getThumbnails,
  createProfile
}