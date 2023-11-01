const mailRouter = require('express').Router()
const nodemailer = require('nodemailer')
const corsMiddleware = require('../cors')

mailRouter.use(corsMiddleware)

mailRouter.get('/', async (request, response, next) => {
  response.json({
    sendMail: 'API to send our emails'
  })
})

mailRouter.post('/', async (request, response, next) => {
  const { body, headers } = request
  const { to, subject, content } = body

  // console.log('headers', request.headers)

  if (!to || !subject || !content) {
    return response.status(400).json({ error: 'missing some required fields' })
  }

  // if (!validCORS(headers.origin)) {
  //   return response.status(403).json({ error: 'forbidden by CORS' })
  // }

  // console.log('validCORS: ', corsMiddleware.validCORS(headers.origin), headers.origin)

  if (!corsMiddleware.validCORS(headers.origin)) {
    return response.status(403).json({ error: 'forbidden by CORS' })
  }

  if (!process.env.MAIL_USR || !process.env.MAIL_PASS) {
    return response.status(500).json({ error: 'Missing ENV params for mail account credentials' })
  }

  console.log('header', request.headers)

  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.es',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USR,
      pass: process.env.MAIL_PASS
    }
  })

  async function main () {
    const info = await transporter.sendMail({
      from: '"Hola que ase 🍹" <hello@pictau.com>',
      to,
      subject,
      html: content
    })

    console.log('Message sent: %s', info.messageId)
  }

  main().catch(err => {
    next(err)
  })

  response.send({
    mail: 'sentOK'
    // name: user.name,
    // username: user.username,
    // token
  })
})

module.exports = mailRouter
