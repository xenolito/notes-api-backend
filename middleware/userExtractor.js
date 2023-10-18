const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization') // request.get() --> método de express para acceder a las cabeceras (más simple que request.headers... etc)
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    // authorization vendrá en la cabecera de la forma "Bearer kljkljkljljkljkjlklj"
    // Buscamos el substring desde la posición 7 (omitiendo la parte "Bearer ")
    token = authorization.substring(7)
  }

  if (!token) {
    return response.status(401).json({ error: 'token is missing' })
  }

  let decodedToken = ''
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return next(error)
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = decodedToken.id

  request.userId = userId

  next()
}
