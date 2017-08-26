const express = require('express')
const app = express()
const moment = require('moment')
const morgan = require('morgan')
const logger = morgan('dev')
const bodyParser = require('body-parser')
const env = require('node-env-file')
const fs = require('fs')
const envFile = `${__dirname}/.env`
if (fs.existsSync(envFile)) env(envFile)


const formidable = require('formidable')
const path = require('path')
const uploadDir = path.join(__dirname, '/uploads/') 

console.log(uploadDir)


app.post('/profile', (req, res, next) => {
  var form = new formidable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = uploadDir

  form.parse(req, (err, fields, files) => {
    console.log('parsing...', files)
    if (err) return res.status(500).json({ error: err })
    res.status(200).json({ uploaded: true })
  })

  form.on('fileBegin', function (name, file) {
    console.log('saving...')
    const [fileName, fileExt] = file.name.split('.')
    file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)
  })
})

app.set('port', (process.env.PORT || 3000))

// mongoose connection
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_CONNECTION, { useMongoClient: true })

// schema
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  description: String,
  createAt: { type: Date, default: Date.now },
  done: Boolean
})

const TodoModel = mongoose.model('todos', TodoSchema)

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
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// post router
app.post('/profile', (req, res) => {
  
  res.end()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.get('/todos', (req, res) => {
//   TodoModel.find({}, (err, docs) => {
//     if (err) res.sendStatus(404)
//     res.json(docs)
//   })
// })

// app.get('/todos/:id', (req, res) => {
//   TodoModel.findById(req.params.id, (err, docs) => {
//     if(err) res.sendStatus(404)
//     res.status(200).json(docs)
//   })
// })

// app.post('/todos', (req, res) => {
//   TodoModel.create(req.body, (err, docs) => {
//     if (err) res.sendStatus(412)
//     res.status(201).json(docs)
//   })
// })

// app.put('/todos/:id', (req, res) => {
//   TodoModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
//     if (err) res.sendStatus(404)
//     res.sendStatus(204)
//   })
// })

// app.delete('/todos/:id', (req, res) => {
//   TodoModel.findByIdAndRemove(req.params.id, (err) => {
//     if (err) res.sendStatus(404)
//     res.sendStatus(204)
//   })
// })

require('./routes/todos')(app, TodoModel)


// listen
app.listen(app.get('port'))
