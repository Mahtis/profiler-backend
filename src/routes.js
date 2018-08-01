const index = require('./controllers/index_controller')
const profiles = require('./controllers/profile_controller')
const responses = require('./controllers/response_controller')
const accounts = require('./controllers/account_controller')
const questions = require('./controllers/question_controller')
const login = require('./controllers/login_controller')

const BASE_PATH = '/api'

module.exports = (app) => {
  app.use(`${BASE_PATH}/`, index)
  app.use(`${BASE_PATH}/login`, login)
  app.use(`${BASE_PATH}/accounts`, accounts)
  app.use(`${BASE_PATH}/profiles`, profiles)
  app.use(`${BASE_PATH}/responses`, responses)
  app.use(`${BASE_PATH}/questions`, questions)
}
