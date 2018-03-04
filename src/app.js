const express = require('express')

const PORT = 8080

const app = express()

app.get('/data', async function (req, res) {
    res.status(200).send('<h1>YOU GET HERE</h1>')
})

app.get('*', async function (req, res) {
    res.status(200).json({hello: 'world'})
})

app.listen(PORT, function() {
    console.log(`Example app listening on port: ${PORT}!` )
})