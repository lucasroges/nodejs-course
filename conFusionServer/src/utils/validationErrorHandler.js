const validationErrorHandler = (error, res) => {
    console.log(error)
    const message = `Error: ${error._message}`
    const response = {
        message
    }
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.json(response)
}

module.exports = validationErrorHandler