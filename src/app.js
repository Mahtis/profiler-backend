const express = require('express')
const Account = require('./models/index').Account

const PORT = 8000

const app = express()

app.get('/data', async function (req, res) {
    await Account.sync( {force: true} )
    await Account.create( {username: 'Jeff'} )
    const jeff = await Account.findOne({where: {username: 'Jeff'}})
    res.status(200).send(`<h1>YOU GET HERE ${jeff.username}, ${jeff.id} </h1>`)
})

app.get('*', async function (req, res) {
    res.status(200).json({hello: 'world'})
})

app.listen(PORT, function() {
    console.log(`Example app listening on port: ${PORT}!` )
})