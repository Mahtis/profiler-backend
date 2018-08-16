const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const PORT = 8000

const app = express()

const ROOT_PATH = '/Users/mikkotiainen/Github/profiler-backend/'

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

routes(app)

app.get('*', async (req, res) => {
  res.status(200).json({ hello: 'world' })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`)
})