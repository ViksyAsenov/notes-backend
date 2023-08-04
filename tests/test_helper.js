const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'ezpzez',
    important: false
  }, {
    content: 'just a test',
    important: true
  }
]

const noneExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note.id.toString()
}

const notesInDB = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  noneExistingId,
  notesInDB,
  usersInDB
}