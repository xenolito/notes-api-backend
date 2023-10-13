const mongoose = require('mongoose')
// const password = require('./dbPassword')

// const connectionString = `mongodb+srv://xenolito:${password}@cluster0-ireland.fptin4c.mongodb.net/notes?retryWrites=true&w=majority`
const connectionString = process.env.MONGO_DB_URI

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

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
