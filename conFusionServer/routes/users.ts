import express, { Router } from 'express'
import bodyParser from 'body-parser'
import { Users } from '../models'
import { httpResponseHandler } from '../handlers'
import session from 'express-session'

export const users = Router()

users.use(bodyParser.json())

users.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('respond with a resource')
})

users.post('/signup', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { username, password } = req.body
  const usernameExists = await Users.findOne({
    username
  })

  if (usernameExists) {
    return httpResponseHandler(res, 401, `Username ${username} already exists!`)
  }

  const createdUser = await Users.create({
    username,
    password
  })

  if (!createdUser) {
    return httpResponseHandler(res, 500, 'Error creating new user')
  }

  return httpResponseHandler(res, 200, 'Successfully registered!')
})

users.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session) {
    return httpResponseHandler(res, 401, 'Unauthorized access')
  }

  if (!req.session.user) {
    const { authorization } = req.headers
    if (!authorization) {
      return httpResponseHandler(res, 401, 'Unauthorized access')
    }

    const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':')

    const user = await Users.findOne({
      username
    })
    if (!user) {
      return httpResponseHandler(res, 403, `Username ${username} does not exists!`)
    }

    if (password !== user.password) {
      return httpResponseHandler(res, 403, 'Password incorrect!')
    }

    req.session.user = 'authenticated'
    return httpResponseHandler(res, 200, 'You are authenticated')
  }

  return httpResponseHandler(res, 200, 'You are already authenticated')
})

users.get('/logout', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session) {
    return httpResponseHandler(res, 403, 'You are not logged in')
  }

  req.session.destroy((err: any) => {
    if (err) {
      return httpResponseHandler(res, 500, 'Error logging out')
    }
  })

  res.clearCookie('session-id')
  res.redirect('/')
})