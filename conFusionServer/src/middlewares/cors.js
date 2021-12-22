const cors = require('cors')

const whilelist = [
    'http://localhost:3000',
    'https://localhost:3443'
]

const corsOptionsDelegate = (req, callback) => {
    const origin = whilelist.includes(req.header('Origin'))
    const corsOptions = { origin }

    callback(null, corsOptions)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionsDelegate)