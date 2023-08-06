const express = require('express')
require('dotenv').config();
require('./db/mongoose')
const UserRouter = require('./routes/user')
const TaskRouter = require('./routes/task')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/user', UserRouter)
app.use('/task', TaskRouter)

app.use((err, req, res, next) => {
    res.status(400).send({ error: err.message })
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

