import express from 'express'
import { createServer } from 'http'

const HOSTNAME = 'localhost'
const PORT = 3000

const app = express()

app.use( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.headers)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><body><h1>This is an express server</h1></body></html>')
})

const server = createServer(app)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on ${PORT}`)
})

