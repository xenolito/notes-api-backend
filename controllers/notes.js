const notesRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')
const cors = require('cors')

notesRouter.use(cors())

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 0
  })

  // console.log(notes)
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

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
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

notesRouter.put('/:id', userExtractor, async (request, response, next) => {
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

// This middleware notesRouter, has a second middleware 'userExtractor' before doing his work... so we already have extraced the user AND saved to the request as another key (request.userId)
notesRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  // if (!userId) {
  //   next({ error: 'note.userId is missing' })
  //   return response.status(400).json({
  //     error: 'note.userId is missing'
  //   })
  // }

  // // check if id is a string and with a valid objectID type of string "match(/^[0-9a-fA-F]{24}$/)"

  // if (!typeof userId === 'string' || !userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
  //   return response.status(400).json({
  //     error: 'note.userId is not a valid id'
  //   })
  // }

  const { userId } = request

  const user = await User.findById(userId)

  if (!user) {
    return response.status(401).json({
      error: 'user not matching registered one'
    })
  }

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
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
