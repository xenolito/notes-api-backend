const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = []

// let notes = [
//   {
//     id: 1,
//     content: 'Me tengo que suscribir a @xenolito en twitch',
//     date: '2019-05-30T17:30:31.098Z',
//     important: false
//   },
//   {
//     id: 2,
//     content: 'Tengo que estudir más!',
//     date: '2019-05-30T18:39:34.091Z',
//     important: true
//   },
//   {
//     id: 3,
//     content: 'Tengo que monetizar mis conocimientos',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo @@</h1>')
})

app.get('/api/notes', (request, response) => {
  console.log(notes)
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log({ id })
  const note = notes.find(note => note.id === id)
  if (note) {
    response.send(note)
  } else {
    response.status(404).json({ error: 'not found' }).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = notes.length ? Math.max(...ids) : -1

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
    userId: note.userId
  }

  // notes = notes.concat(newNote)
  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 4001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
