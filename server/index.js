const express = require('express')
const path = require('path')
const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
})

app.get('/style', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/styles.css'))
})

app.get('/script', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.js'))
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})