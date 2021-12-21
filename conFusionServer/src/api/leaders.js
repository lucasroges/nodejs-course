const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const Leaders = require('../models/leaders')

const errorHandler = require('../utils/errorHandler')
const validationErrorHandler = require('../utils/validationErrorHandler')
const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../../authenticate')

const cors = require('./cors')

const leaders = express.Router()

leaders.use(bodyParser.json())

leaders.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, async (req, res) => {
        try {
            const leaders = await Leaders.find({})
            const message = leaders ? `${leaders.length} leaders found!` : 'No leaders found!'
            return httpResponseHandler(res, 200, message, leaders)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const leader = req.body
            const createdLeader = await Leaders.create(leader)
            const message = `Leader ${leader.name} was created!`
            return httpResponseHandler(res, 200, message, createdLeader)
        } catch (err) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /leaders')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const deletedLeaders = await Leaders.deleteMany({})
            const message = deletedLeaders.deletedCount ? `${deletedLeaders.deletedCount} leaders deleted!` : 'No leaders deleted!'
            return httpResponseHandler(res, 200, message)
        } catch (err) {
            return errorHandler(err, res)
        }
    })

leaders.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, async (req, res) => {
        try {
            const { leaderId } = req.params
            const leader = await Leaders.findById(leaderId)
            if (!leader) {
                return httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} found!`
            return httpResponseHandler(res, 200, message, leader)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        const { leaderId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /leaders/${leaderId}`)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { leaderId } = req.params
            const leaderUpdatedParams = req.body
            const updatedLeader = await Leaders.findByIdAndUpdate(leaderId, {
                $set: leaderUpdatedParams
            }, { new: true })
            if (!updatedLeader) {
                return httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} updated!`
            return httpResponseHandler(res, 200, message, updatedLeader)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { leaderId } = req.params
            const deletedLeader = await Leaders.findByIdAndDelete(leaderId)
            if (!deletedLeader) {
                return httpResponseHandler(res, 404, `Leader ${leaderId} not found!`)
            }
            const message = `Leader ${leaderId} deleted!`
            return httpResponseHandler(res, 200, message, deletedLeader)
        } catch (err) {
            return errorHandler(err, res)
        }
    })

module.exports = leaders