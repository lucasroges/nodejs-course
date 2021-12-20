const express = require('express')
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')

const indexRouter = require('./routes/index')
const users = require('./routes/users')
const dishes = require('./routes/dishes')
const promotions = require('./routes/promotions')
const leaders = require('./routes/leaders')

const config = require('./config')

const URL = config.mongoUrl
const secret = config.secretKey

const connection = mongoose.connect(URL)
connection.then(
  (db) => {
    console.log(`Successfully connected to ${URL}`)
  }, (err) => {
    throw new Error(err)
  }
)

const app = express()

app.all('*', (req, res, next) => {
  const { secure } = req

  if (!secure) {
    const { hostname, url } = req
    const securePort = app.get('securePort')
    console.log(`Redirecting to https://${hostname}:${securePort}${url}`)
    return res.redirect(307, `https://${hostname}:${securePort}${url}`)
  }

  return next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())

app.use('/', indexRouter)
app.use('/users', users)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/dishes', dishes)
app.use('/promotions', promotions)
app.use('/leaders', leaders)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app