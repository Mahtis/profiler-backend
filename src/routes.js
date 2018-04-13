const index = require('./controllers/index_controller')
const profiles = require('./controllers/profile_controller')
const responses = require('./controllers/response_controller')

module.exports = (app) => {
  app.use('/', index)
  app.use('/profiles', profiles)
  app.use('/responses', responses)
}