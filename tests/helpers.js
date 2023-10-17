const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Aprendiendo fullstack JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Testing en fullstack JS',
    important: true,
    date: new Date()
  }
]

const initialUsers = [
  {
    username: 'xenolito',
    name: 'Oscar',
    password: 'pepe'
  }
]

const getUsers = async () => {
  const usersDBAfter = await User.find({})
  return usersDBAfter.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  initialUsers,
  api,
  mongoose,
  server,
  getUsers
}
