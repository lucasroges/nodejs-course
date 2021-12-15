const express = require('express')
const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const mongoose = require('mongoose')

const indexRouter = require('./routes/index')
const users = require('./routes/users')
const dishes = require('./routes/dishes')
const promotions = require('./routes/promotions')
const leaders = require('./routes/leaders')

const httpResponseHandler = require('./handlers/httpResponseHandler')

const URL = 'mongodb://localhost:27017/conFusion'
const secret = '0d95ec4dcfe25c21a72745f33a13b00e'

const connection = mongoose.connect(URL)
connection.then(
  (db) => {
    console.log(`Successfully connected to ${URL}`)
  }, (err) => {
    throw new Error(err)
  }
)

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//app.use(cookieParser(secret))

app.use(session({
  name: 'session-id',
  secret,
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

app.use('/', indexRouter)
app.use('/users', users)

const auth = (req, res, next) => {
  const { user } = req.session

  if (!user) {
    return httpResponseHandler(res, 401, 'You are not authenticated')
  }

  if (user !== 'authenticated') {
    return httpResponseHandler(res, 401, 'You are not authenticated')
  }

  return next()
}
app.use(auth)

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