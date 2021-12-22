const bodyParser = require('body-parser')
const express = require('express')
const passport = require('passport')

const { Users } = require('../models/user')

const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../middlewares/authenticate')

const cors = require('../middlewares/cors')

const usersRouter = express.Router()

usersRouter.use(bodyParser.json())

usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
  try {
    const users = await Users.find({})
    const message = `${users.length} users found!`
    return httpResponseHandler(res, 200, message, users)
  } catch (err) {
    return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
  }
})

usersRouter.post('/signup', cors.corsWithOptions, async (req, res, next) => {
  const { username, password, firstName, lastName } = req.body

  if (!username || !password || !firstName || !lastName) {
    return httpResponseHandler(res, 400, 'Missing parameters on the request body!')
  }

  Users.register(new Users({ username, firstName, lastName }), password, async (err, user) => {
    if (err) {
      return httpResponseHandler(res, 500, 'Error creating new user')
    }

    passport.authenticate('local')(req, res, () => {
      return httpResponseHandler(res, 200, 'Successfully registered!')
    })
  })
})

usersRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const { _id } = req.user
  const token = authenticate.getToken({ _id })
  return httpResponseHandler(res, 200, 'You are logged in!', { token })
})

usersRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (!req.session) {
    return httpResponseHandler(res, 403, 'You are not logged in')
  }

  req.session.destroy()
  res.clearCookie('session-id')
  res.redirect('/')
})

usersRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  const { user } = req
  if (!user) {
    return httpResponseHandler(res, 403, 'You are not authorized to login through Facebook')
  }

  const { _id } = req.user
  const token = authenticate.getToken({ _id })
  return httpResponseHandler(res, 200, 'You are logged in!', { token })
})

module.exports = usersRouter