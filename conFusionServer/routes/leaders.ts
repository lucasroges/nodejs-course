import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { } from 'mongoose'
import { Leaders } from '../models'
import { errorHandler, httpResponseHandler, validationErrorHandler } from '../handlers'

export const leaders = Router()

leaders.use(bodyParser.json())

leaders.route('/')
    .get(async (req: express.Request, res: express.Response) => {
        try {
            const leaders = await Leaders.find({})
            const message = leaders ? `${leaders.length} leaders found!` : 'No leaders found!'
            const response = {
                message,
                leaders
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post(async (req: express.Request, res: express.Response) => {
        try {
            const leader = req.body
            const createdLeader = await Leaders.create(leader)
            const message = `Leader ${leader.name} was created!`
            const response = {
                message,
                createdLeader
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(response)
        } catch (err: any) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put((req: express.Request, res: express.Response) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /leaders')
    })
    .delete(async (req: express.Request, res: express.Response) => {
        try {
            const deletedLeaders = await Leaders.deleteMany({})
            const message = deletedLeaders.deletedCount ? `${deletedLeaders.deletedCount} leaders deleted!` : 'No leaders deleted!'
            const response = {
                message
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })

leaders.route('/:leaderId')
    .get(async (req: express.Request, res: express.Response) => {
        try {
            const { leaderId } = req.params
            const leader = await Leaders.findById(leaderId)
            if (!leader) {
                httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} found!`
            const response = {
                message,
                leader
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req: express.Request, res: express.Response) => {
        const { leaderId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /leaders/${leaderId}`)
    })
    .put(async (req: express.Request, res: express.Response) => {
        try {
            const { leaderId } = req.params
            const leaderUpdatedParams = req.body
            const updatedLeader = await Leaders.findByIdAndUpdate(leaderId, {
                $set: leaderUpdatedParams
            }, { new: true })
            if (!updatedLeader) {
                httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} updated!`
            const response = {
                message,
                updatedLeader
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(async (req: express.Request, res: express.Response) => {
        try {
            const { leaderId } = req.params
            const deletedLeader = await Leaders.findByIdAndDelete(leaderId)
            if (!deletedLeader) {
                httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} deleted!`
            const response = {
                message
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
