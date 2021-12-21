const express = require('express')

const indexRouter = express.Router()

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
});

module.exports = indexRouter