require('dotenv').config()

require('./mongo')
const express = require('express')
const cors = require('cors')

const logger = require('./loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')
const mailRouter = require('./controllers/sendMail')
// const connectionStr = require('./mongo')

const app = express()

// config express.json() to verify that request.body is a well formed json!!
const verifyJson = {
  verify: (req, res, buf, encoding) => {
    try { JSON.parse(buf) } catch (e) {
      res.status(400).json({ error: 'request.body is a malformed json' })
    }
  }
}

app.use(cors())

app.use(express.json(verifyJson))
app.use(express.static('public'))
app.use(logger)

// app.get('/', (request, response) => {
//   // response.send('<h1>Bienvenido a la API de PICTAU©</h1><p>Browse all notes <a href="/api/notes">here</a><p>')
//   response.sendFile('index2.html')
// })

app.use('/api/notes', notesRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use('/api/mail', mailRouter)

app.use(notFound)

app.use(handleError)

// const PORT = process.env.PORT || 4001
const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
