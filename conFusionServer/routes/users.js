const bodyParser = require('body-parser')
const express = require('express')
const passport = require('passport')

const User = require('../models/user')
const httpResponseHandler = require('../handlers/httpResponseHandler')
const authenticate = require('../authenticate')

const users = express.Router()

users.use(bodyParser.json())

users.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

users.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return httpResponseHandler(res, 400, 'Missing parameters on the request body!')
  }

  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      return httpResponseHandler(res, 500, 'Error creating new user')
    }

    passport.authenticate('local')(req, res, () => {
      return httpResponseHandler(res, 200, 'Successfully registered!')
    })
  })
})

users.post('/login', passport.authenticate('local'), (req, res) => {
  const { _id } = req.user
  const token = authenticate.getToken({ _id })
  return httpResponseHandler(res, 200, 'You are logged in!', { token })
})

users.get('/logout', (req, res, next) => {
  if (!req.session) {
    return httpResponseHandler(res, 403, 'You are not logged in')
  }

  req.session.destroy()
  res.clearCookie('session-id')
  res.redirect('/')
})

module.exports = users