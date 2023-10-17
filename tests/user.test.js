const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, mongoose, server, getUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'pepe', passwordHash, name: 'Oscar' })
    await user.save()
  })

  test('working as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'xenolito',
      name: 'Oscar',
      password: 'pinkpanther'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and mesage when username is already taken', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: 'pepe',
      name: 'Oscarito',
      password: 'pinkpanther'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain('`username` to be unique')
    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
