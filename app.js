const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// require('dotenv').config()
// const express = require('express')
// const cors = require('cors')
// const app = express()
// const Note = require('./models/note')
// const notesRouter = require('./controllers/notes')

// app.use(cors())
// app.use('/api/notes', notesRouter)
// app.use(express.static('build'))
// app.use(express.json())


// app.use(requestLogger)

// app.get('/api/notes', (request, response) => {
//   Note.find({}).then(notes => {
//     response.json(notes)
//   })
// })

// app.get('/api/notes/:id', (request, response, next) => {
//   Note.findById(request.params.id).then(note => {
//     if(note) {
//       response.json(note)
//     } else {
//       response.status(404).end()
//     }
//   })
//     .catch(error => next(error))
// })

// app.post('/api/notes', (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false
//   })

//   note.save()
//     .then(savedNote => {
//       response.json(savedNote)
//     })
//     .catch(error => next(error))
// })

// app.put('/api/notes/:id', (request, response, next) => {
//   const { content, important } = request.body

//   Note.findByIdAndUpdate(
//     request.params.id,
//     { content, important },
//     { new: true, runValidators: true, context: 'query' }
//   )
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

// app.delete('/api/notes/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })


// app.use(unknownEndpoint)


// app.use(errorHandler)

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })