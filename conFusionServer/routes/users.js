const bodyParser = require('body-parser')
const express = require('express')

const users = express.Router()

users.use(bodyParser.json())

users.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = users

/*
users.post('/signup', async (req, res, next) => {
  const { username, password } = req.body

  const registeredUser = await Users.register(new Users({
    username
  }), password)
  if (registeredUser) {
    return httpResponseHandler(res, 500, 'Error creating new user')
  }

  const authenticatedUser = passport.authenticate('local')
  if (!authenticatedUser) {
    return httpResponseHandler(res, 500, 'Error authenticating new user')
  }

  return httpResponseHandler(res, 200, 'Successfully registered!')
})

users.post('/login', passport.authenticate('local'), (req, res) => {
  return httpResponseHandler(res, 200, 'You are successfully logged in!')
})

users.get('/logout', (req, res, next) => {
  if (!req.session) {
    return httpResponseHandler(res, 403, 'You are not logged in')
  }

  req.session.destroy((err) => {
    if (err) {
      return httpResponseHandler(res, 500, 'Error logging out')
    }
  })

  res.clearCookie('session-id')
  res.redirect('/')
})
*/