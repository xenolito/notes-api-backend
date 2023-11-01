const testRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const cors = require('cors')

testRouter.use(cors())

testRouter.post('/reset', async (request, response, next) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter
