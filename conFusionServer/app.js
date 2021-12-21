const express = require('express')
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')

const http = require('http')
const https = require('https')
const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config()

const indexRouter = require('./src/api/index')
const users = require('./src/api/users')
const dishes = require('./src/api/dishes')
const promotions = require('./src/api/promotions')
const leaders = require('./src/api/leaders')
const uploadRouter = require('./src/api/upload')
const normalizePort = require('./src/utils/normalizePort')
const onListening = require('./src/utils/onListening')
const onError = require('./src/utils/onError')

const MONGO_URL = process.env.MONGO_URL

const connection = mongoose.connect(MONGO_URL)
connection
.then((db) => {
  console.log(`Successfully connected to ${MONGO_URL}`)
})
.catch((err) => {
  console.log(err)
})


const PORT = normalizePort(process.env.PORT)
const SECURE_PORT = normalizePort(process.env.SECURE_PORT)

const app = express()

app.set('port', PORT)
app.set('securePort', SECURE_PORT)

const server = http.createServer(app)
server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

const options = {
  key: fs.readFileSync(`${__dirname}/src/config/private.key`),
  cert: fs.readFileSync(`${__dirname}/src/config/certificate.cert`)
}

const secureServer = https.createServer(options, app)
secureServer.listen(SECURE_PORT)
secureServer.on('error', onError);
secureServer.on('listening', onListening);

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

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())

app.use('/', indexRouter)
app.use('/users', users)

app.use('/dishes', dishes)
app.use('/promotions', promotions)
app.use('/leaders', leaders)
app.use('/imageUpload', uploadRouter)

module.exports = app