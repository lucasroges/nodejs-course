import express from 'express'
import { createServer } from 'http'
import morgan from 'morgan'

const HOSTNAME = 'localhost'
const PORT = 3000

const app = express()
app.use(morgan('dev'))

app.use(express.static(`${__dirname}/public`))

app.use( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<html><body><h1>This is an express server</h1></body></html>')
})

const server = createServer(app)

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on ${PORT}`)
})

