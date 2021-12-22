const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')

const http = require('http')
const https = require('https')
const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config()

const usersRouter = require('./src/api/users')
const dishesRouter = require('./src/api/dishes')
const promotionsRouter = require('./src/api/promotions')
const leadersRouter = require('./src/api/leaders')
const uploadRouter = require('./src/api/upload')
const favoritesRouter = require('./src/api/favorites')

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

app.use('/users', usersRouter)

app.use('/dishes', dishesRouter)
app.use('/promotions', promotionsRouter)
app.use('/leaders', leadersRouter)
app.use('/imageUpload', uploadRouter)

app.use('/favorites', favoritesRouter)

module.exports = app