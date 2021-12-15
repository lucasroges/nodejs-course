const httpResponseHandler = (res, status, message, data) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    if (status === 401) {
        res.setHeader('WWW-Authenticate', 'Basic')
    }
    res.json({
        status,
        message,
        data
    })
}

module.exports = httpResponseHandler