import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { indexRouter } from './routes/index'
import { users } from './routes/users'
import { dishes } from './routes/dishes'
import { promotions } from './routes/promotions'
import { leaders } from './routes/leaders'

import { connect } from 'mongoose'

import { unauthorizedHandler } from './handlers'

const URL = 'mongodb://localhost:27017/conFusion'

const connection = connect(URL)
connection.then(
  (db) => {
    console.log(`Successfully connected to ${URL}`)
  }, (err) => {
    throw new Error(err)
  }
)


export const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser('0d95ec4dcfe25c21a72745f33a13b00e'))

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.signedCookies
  if (!user) {
    const { authorization } = req.headers
    if (!authorization) {
      return unauthorizedHandler(res)
    }

    const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':')

    if (username !== 'admin' || password !== 'password') {
      return unauthorizedHandler(res)
    }

    res.cookie('user', 'admin', { signed: true })
    return next()
  }

  if (user !== 'admin') {
    return unauthorizedHandler(res)
  }

  return next()
}
app.use(auth)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', users)
app.use('/dishes', dishes)
app.use('/promotions', promotions)
app.use('/leaders', leaders)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});
