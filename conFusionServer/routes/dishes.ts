import bodyParser from 'body-parser'
import express, { Router } from 'express'

export const dishes = Router()

dishes.use(bodyParser.json())

dishes.route('/').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end('Sending all the dishes to you!')
})
.post( (req: express.Request, res: express.Response) => {
    res.end(`Adding the dish ${req.body.name}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})
.delete( (req: express.Request, res: express.Response) => {
    res.end('Deleting all the dishes!')
})

dishes.route('/:dishId').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end(`Sending dish ${req.params.dishId} to you!`)
})
.post( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.end(`Updating dish ${req.params.dishId}`)
})
.delete( (req: express.Request, res: express.Response) => {
    res.end(`Deleting dish ${req.params.dishId}`)
})