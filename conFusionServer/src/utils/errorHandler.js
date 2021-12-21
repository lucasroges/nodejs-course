const httpResponseHandler = require('./httpResponseHandler')

const errorHandler = (error, res) => {
    console.log(error)
    httpResponseHandler(res, 500, 'Internal Server Error')
}

module.exports = errorHandler