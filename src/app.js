const express = require('express')
const Account = require('./models/index').Account
const sequelize = require('./models/index').sequelize
const cors = require('cors')
const bodyParser = require('body-parser')
const Profiles = require('./services/profiles')
const Responses = require('./services/responses')
const routes = require('./routes')

const PORT = 8000

const app = express()

const ROOT_PATH = '/Users/mikkotiainen/Github/profiler-backend/'

app.use(cors())
app.use(express.static('public'))
// app.use(bodyParser.json())

routes(app)
/*
app.get('/data', async function (req, res) {
  console.log(req)
  const profile = await Profiles.getProfile(1)
  //sendFile(ROOT_PATH + profile.picture)
  res.status(200).json(profile)
})

app.get('/profiles', async function (req, res) {
  console.log('req')
  const profiles = await Profiles.getAll()
  res.status(200).json(profiles)
})

app.get('/responses', async function (req, res) {
  //const profile = await Profiles.getProfile(1)
  //console.log(Responses.getResponsesForProfile(1))
  //const pq = profile.questions[0].profile_question
  await Responses.getProfileResponseOptionPercentages(1, [1, 10, 18, 26])
  const responses = await Responses.getResponsesForProfile(1)
  res.status(200).json(responses)
})
*/
app.get('*', async function (req, res) {
  res.status(200).json({ hello: 'world' })
})

app.listen(PORT, function () {
  console.log(`Example app listening on port: ${PORT}!`)
})