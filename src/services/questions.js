const { Question, ResponseOption } = require('../models')

const getQuestions = () => (
  Question.findAll({ include: ResponseOption })
)

module.exports = {
  getQuestions
}