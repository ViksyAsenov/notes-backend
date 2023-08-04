const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const User = require('../models/user')

beforeEach(async () => {
  await Note.deleteMany({})
  await User.deleteMany({})

  const noteObjects = helper.initialNotes.map(n => new Note(n))

  const promiseArr = noteObjects.map(note => note.save())
  await Promise.all(promiseArr)
})

describe('get notes', () => {
  test('notes are returned as json', async() => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('ezpzez')
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note can be viewed with a valid id', async () => {
    const notesAtStart = await helper.notesInDB()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('a none existing note can\' be viewed with a valid id and should respond with 404', async () => {
    const nonexistingId = await helper.noneExistingId()

    await api
      .get(`/api/notes/${nonexistingId}`)
      .expect(404)
  })

  test('a note can\'t be viewed with an invalid id and should respond with 400', async () => {
    const invalidId = 'a123bss'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('post notes', () => {
  let headers = null

  beforeEach(async () => {
    const newUser = {
      username: 'admin',
      name: 'Admin Adminov',
      password: 'topsecret',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    }
  })

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'a new note',
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDB()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)

    expect(contents).toContain('a new note')
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set(headers)
      .expect(400)

    const notesAtEnd = await helper.notesInDB()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('put notes', () => {
  let headers = null

  beforeEach(async () => {
    const newUser = {
      username: 'admin',
      name: 'Admin Adminov',
      password: 'topsecret',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    }
  })

  test('update an existing note with valid id and properties', async () => {
    const newNote = {
      content: 'a new note',
      important: false
    }

    let uploadedNoteResult = await api
      .post('/api/notes')
      .send(newNote)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesBeforeUpdate = await helper.notesInDB()

    const updatedNote = {
      content: 'a new note',
      important: true
    }

    await api
      .put(`/api/notes/${uploadedNoteResult.body.id}`)
      .send(updatedNote)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAfterUpdate = await helper.notesInDB()
    expect(notesBeforeUpdate.length).toBe(notesAfterUpdate.length)

    const updatedNoteFromDB = notesAfterUpdate.find(n => n.content === updatedNote.content)
    expect(updatedNoteFromDB.important).toBe(true)
  })
})

describe('delete notes', () => {
  let headers = null

  beforeEach(async () => {
    const newUser = {
      username: 'admin',
      name: 'Admin Adminov',
      password: 'topsecret',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    }
  })

  test('an existing note can be deleted with valid id', async () => {
    const newNote = {
      content: 'a new note',
      important: false
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .set(headers)
      .expect(201)

    const notesAtStart = await helper.notesInDB()
    const noteToDelete = notesAtStart.find(note => note.content === newNote.content)

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set(headers)
      .expect(204)

    const notesAtEnd = await helper.notesInDB()

    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)

    const contents = notesAtEnd.map(n => n.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})