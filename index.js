require('dotenv').config()

require('./mongo')
const express = require('express')
const cors = require('cors')

const logger = require('./loggerMiddleware')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

// const connectionStr = require('./mongo')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(logger)

app.get('/', (request, response) => {
  response.send('<h1>Bienvenido a la API de PICTAU©</h1><p>Browse all notes <a href="/api/notes">here</a><p>')
  // response.sendFile('index2.html')
})

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then((notes) => {
      console.log(notes)
      response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  console.log({ id })
  // const note = notes.find(note => note.id === id)
  Note.findById(id).then((note) => {
    if (note) {
      response.send(note)
    } else {
      response.status(404).json({ error: 'not found' }).end()
    }
  })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  // notes = notes.filter(note => note.id !== id)
  Note.findByIdAndDelete(id)
    .then((resp) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important

  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((resp) => {
      response.status(200).json(resp)
    })
  // notes = notes.filter(note => note.id !== id)
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  // const ids = notes.map(note => note.id)
  // const maxId = notes.length ? Math.max(...ids) : -1

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
    userId: note.userId

  })

  newNote.save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch((err) => {
      console.error(err)
    })
})

app.use(notFound)

app.use(handleError)

// const PORT = process.env.PORT || 4001
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
