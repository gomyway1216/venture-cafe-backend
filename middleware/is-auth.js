const jwt = require('jsonwebtoken')

require('dotenv').config({
  path: '../.env',
})

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  if (!token || token === '') {
    req.isAuth = false
    return next()
  }
  let decodedToken
  try {
    if (!process.env.TOKEN_SECRET_KEY) {
      throw new Error('process.env.TOKEN_SECRET_KEY does not exist')
    }

    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
  } catch (err) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userID = decodedToken.userID
  next()
}
