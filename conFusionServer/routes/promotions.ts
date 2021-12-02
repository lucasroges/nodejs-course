import bodyParser from 'body-parser'
import express, { Router } from 'express'

export const promotions = Router()

promotions.use(bodyParser.json())

promotions.route('/').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end('Sending all the promotions to you!')
})
.post( (req: express.Request, res: express.Response) => {
    res.end(`Adding the promotion ${req.body.name}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
})
.delete( (req: express.Request, res: express.Response) => {
    res.end('Deleting all the promotions!')
})

promotions.route('/:promotionId').all( (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get( (req: express.Request, res: express.Response) => {
    res.end(`Sending promotion ${req.params.promotionId} to you!`)
})
.post( (req: express.Request, res: express.Response) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`)
})
.put( (req: express.Request, res: express.Response) => {
    res.end(`Updating promotion ${req.params.promotionId}`)
})
.delete( (req: express.Request, res: express.Response) => {
    res.end(`Deleting promotion ${req.params.promotionId}`)
})