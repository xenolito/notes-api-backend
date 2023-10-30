const cors = require('cors')

// const corsOriginAllowed = process.env.CORS_ALLOWED.split(', ')

// const corsOptionsDelegate = function (req, callback) {
//   let corsOptions
//   if (corsOriginAllowed.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true }
//     console.log('ORIGIN TRUE')
//   } else {
//     corsOptions = { origin: false }
//   }
//   callback(null, corsOptions)
// }

const corsOptions = {
  origin: 'www.pictau.com',
  optionsSuccessStatus: 200
}

module.exports = cors(corsOptions)
