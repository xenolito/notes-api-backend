const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 0
  })

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

notesRouter.post('/', async (request, response, next) => {
  const {
    userId,
    content,
    important = false
  } = request.body

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  if (!userId) {
    next({ error: 'note.userId is missing' })
    return response.status(400).json({
      error: 'note.userId is missing'
    })
  }

  if (!typeof userId === 'string' || !userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
    return response.status(400).json({
      error: 'note.userId is not a valid id'
    })
  }

  const user = await User.findById(userId)

  if (!user) {
    return response.status(401).json({
      error: 'user not matching registered one'
    })
  }

  const newNote = new Note({
    content,
    important,
    date: new Date().toISOString(),
    user: user._id

  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    response.status(201).json(savedNote)
    await user.save()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
