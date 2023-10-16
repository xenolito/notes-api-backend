const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, passwordHash } = body

  const user = new User({
    user,
    userName,
    passwordHash: password
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
