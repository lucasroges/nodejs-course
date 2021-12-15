const bodyParser = require('body-parser')
const express = require('express')

const User = require('../models/user')
const httpResponseHandler = require('../handlers/httpResponseHandler')

const users = express.Router()

users.use(bodyParser.json())

users.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

users.post('/signup', async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    return httpResponseHandler(res, 400, 'Missing parameters on the request body!')
  }

  const userExists = await User.findOne({ username })
  if (userExists) {
    return httpResponseHandler(res, 400, 'Username already exists!')
  }

  const createdUser = await User.create({
    username,
    password
  })
  if (!createdUser) {
    return httpResponseHandler(res, 500, 'Error creating new user')
  }

  return httpResponseHandler(res, 200, 'Successfully registered!')
})

users.post('/login', async (req, res, next) => {
  const { user } = req.session

  if (!user) {
    const { authorization } = req.headers

    if (!authorization) {
      return httpResponseHandler(res, 400, 'You are not authenticated!')
    }

    const [username, password] = new Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':')

    const user = await User.findOne({ username })

    if (!user) {
      return httpResponseHandler(res, 403, 'User does not exists!')
    }

    if (user.password !== password) {
      return httpResponseHandler(res, 403, 'Password incorrect!')
    }

    req.session.user = 'authenticated'
    return httpResponseHandler(res, 200, 'You are logged in!')
  }

  return httpResponseHandler(res, 200, 'You are already logged in!')
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