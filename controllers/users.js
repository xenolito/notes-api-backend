const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const cors = require('cors')
// const corsMiddleware = require('../cors')

// usersRouter.use(corsMiddleware)
usersRouter.use(cors())

usersRouter.get('/', async (request, response) => {
  // const { headers } = request

  //   const users = await User.find({})
  // if (!corsMiddleware.validCORS(headers.origin)) {
  //   return response.status(403).json({ error: 'forbidden by CORS' })
  // }

  const users = await User.find({}).populate('notes', {
    content: 1, // sí quiero que populate el content de la nota...
    date: 1 // sí quiero que populate el date de la nota...
    // _id: 0 // no quiero el _id de la nota

  }) // añadiendo .populate('notes') devuelve la info de las notas relacionadas en el array de notas, usando el modelo de user, donde aparece indicado que notes: es una referencia al modelo Note. También le podemos pasar al método populate() un objeto de configuración con lo que queremos populate...

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request
    const { username, name, password } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json({
      error
    })
  }
})

module.exports = usersRouter
