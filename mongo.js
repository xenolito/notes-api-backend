const mongoose = require('mongoose')
// const password = require('./dbPassword')

// const connectionString = `mongodb+srv://xenolito:${password}@cluster0-ireland.fptin4c.mongodb.net/notes?retryWrites=true&w=majority`
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = (NODE_ENV === 'test')
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// conexión a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((resp) => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.log(error)
  mongoose.disconnect()
})
