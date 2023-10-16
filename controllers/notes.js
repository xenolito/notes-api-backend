const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})

  console.log(notes)
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const { id } = request.params
  console.log('Note id:', { id })

  try {
    const note = await Note.findById(id)
    if (note) {
      response.send(note)
    } else {
      response.status(404).json({ error: 'not found' }).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  // notes = notes.filter(note => note.id !== id)
  try {
    const res = await Note.findByIdAndDelete(id)
    if (!res) response.status(204).end()
    else response.status(200).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params

  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important

  }

  try {
    const resp = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    response.status(200).json(resp)
  } catch (error) {
    next(error)
  }
  // notes = notes.filter(note => note.id !== id)
})

notesRouter.post('/', async (request, response) => {
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

  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    console.log(error)
  }
})

module.exports = notesRouter
