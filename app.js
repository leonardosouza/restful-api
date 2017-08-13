const express = require('express')
const app = express()
const moment = require('moment')
const morgan = require('morgan')
const logger = morgan('dev')

// mongoose connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo', { useMongoClient: true })

// schema
const Schema = mongoose.Schema
// const ObjectId = Schema.ObjectId

const TodoSchema = new Schema({
  description: String,
  createAt: Date,
  done: Boolean
})

const TodoModel = mongoose.model('Todo', TodoSchema)

// middleware
const requestCurrentTime = (req, res, next) => {
  req.currentTime = moment().format('LLLL')
  next()
}

// middleware
const myLogger = (req, res, next) => {
  console.log(`OUTPUT: ==> ${req.currentTime}`)
  next()
}

// register middlewares
app.use(requestCurrentTime)
app.use(myLogger)
app.use(logger)

// get router
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/todos', (req, res) => {
  TodoModel.find({}, (err, docs) => {
    res.json(docs)
  })
})

// listen
app.listen(3000)
