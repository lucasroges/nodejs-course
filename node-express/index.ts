import bodyParser from 'body-parser'
import express from 'express'
import { createServer } from 'http'
import morgan from 'morgan'

const HOSTNAME = 'localhost'
const PORT = 3000

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())

app.all('/dishes', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})

app.get('/dishes', (req: express.Request, res: express.Response) => {
    res.end('Sending all the dishes to you!')
})

app.post('/dishes', (req: express.Request, res: express.Response) => {
    res.end(`Adding the dish ${req.body.name}`)
})

app.put('/dishes', (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})

app.delete('/dishes', (req: express.Request, res: express.Response) => {
    res.end('Deleting all the dishes!')
})

app.get('/dishes/:dishId', (req: express.Request, res: express.Response) => {
    res.end(`Sending dish ${req.params.dishId} to you!`)
})

app.post('/dishes/:dishId', (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})

app.put('/dishes/:dishId', (req: express.Request, res: express.Response) => {
    res.end(`Updating dish ${req.params.dishId}`)
})

app.delete('/dishes/:dishId', (req: express.Request, res: express.Response) => {
    res.end(`Deleting dish ${req.params.dishId}`)
})

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

