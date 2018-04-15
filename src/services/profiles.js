const { Op } = require('sequelize')
const { Profile, Question, ResponseOption } = require('../models')

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

module.exports = { getProfile, getAll, getProfiles, getNProfiles }