import bodyParser from 'body-parser'
import express, { Router } from 'express'

export const leaders = Router()

leaders.use(bodyParser.json())

leaders.route('/').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end('Sending all the leaders to you!')
})
.post( (req: express.Request, res: express.Response) => {
    res.end(`Adding the leader ${req.body.name}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
})
.delete( (req: express.Request, res: express.Response) => {
    res.end('Deleting all the leaders!')
})

leaders.route('/:leaderId').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end(`Sending leader ${req.params.leaderId} to you!`)
})
.post( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.end(`Updating leader ${req.params.leaderId}`)
})
.delete( (req: express.Request, res: express.Response) => {
    res.end(`Deleting leader ${req.params.leaderId}`)
})