const notesRouter = require('express').Router()
const Note = require('../models/note')
const userExtractor = require('../utils/middleware').userExtractor

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  const noteToUpdate = await Note.findById(request.params.id)

  if(!(noteToUpdate.user._id.toString() === user._id.toString())) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const note = {
    content: body.content,
    important: body.important
  }

  let updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true , runValidators: true, context: 'query' })
  response.json(updatedNote)
})

notesRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const noteToDelete = await Note.findById(request.params.id)

  if(!(noteToDelete.user._id.toString() === user._id.toString())) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter