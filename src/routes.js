const index = require('./controllers/index_controller')
const profiles = require('./controllers/profile_controller')
const responses = require('./controllers/response_controller')
const login = require('./controllers/login_controller')

module.exports = (app) => {
  app.use('/', index)
  app.use('/login', login)
  app.use('/profiles', profiles)
  app.use('/responses', responses)
}