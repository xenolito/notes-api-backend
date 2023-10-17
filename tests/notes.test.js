const Note = require('../models/Note')
const User = require('../models/User')
const { initialNotes, initialUsers, api, mongoose, server, getUsers } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()

  await User.deleteMany({})
  const user1 = new User(initialUsers[0])
  await user1.save()
})

test('notes are returned as json', async () => {
  await api.get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about orey', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('Aprendiendo fullstack JS')
})

test('a valid note can be added', async () => {
  // creamos nota
  const users = await getUsers()

  const newNote = {
    content: 'Proximamente en @xenolito world',
    important: true,
    userId: users[0].id
  }
  // enviamos nota por post a la bbdd (utilizando el método .send() de supertest) y validamos que la respuesta es la que se espera
  await api.post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Adicionalmente, podemos ver si existe una nota cont el content que hemos enviado.
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain(newNote.content)
})

test('crete a note with missing userId', async () => {
  // creamos nota
  // const users = await getUsers()

  const newNote = {
    content: 'Proximamente en @xenolito world',
    important: true
    // userId: users[0].id
  }
  // enviamos nota por post a la bbdd (utilizando el método .send() de supertest) y validamos que la respuesta es la que se espera
  await api.post('/api/notes')
    .send(newNote)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('crete a note with wrong userId', async () => {
  const newNote = {
    content: 'Proximamente en @xenolito world',
    important: 1,
    userId: 1
  }
  // enviamos nota por post a la bbdd (utilizando el método .send() de supertest) y validamos que la respuesta es la que se espera
  await api.post('/api/notes')
    .send(newNote)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
