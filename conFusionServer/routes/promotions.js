const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const Promotions = require('../models/promotions')

const errorHandler = require('../handlers/errorHandler')
const validationErrorHandler = require('../handlers/validationErrorHandler')
const httpResponseHandler = require('../handlers/httpResponseHandler')

const authenticate = require('../authenticate')

const cors = require('./cors')

const promotions = express.Router()

promotions.use(bodyParser.json())

promotions.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, async (req, res) => {
        try {
            const promotions = await Promotions.find({})
            const message = promotions ? `${promotions.length} promotions found!` : 'No promotions found!'
            return httpResponseHandler(res, 200, message, promotions)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const promotion = req.body
            const createdPromotion = await Promotions.create(promotion)
            const message = `Promotion ${promotion.name} was created!`
            return httpResponseHandler(res, 200, message, createdPromotion)
        } catch (err) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /promotions')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const deletedPromotions = await Promotions.deleteMany({})
            const message = deletedPromotions.deletedCount ? `${deletedPromotions.deletedCount} promotions deleted!` : 'No promotions deleted!'
            return httpResponseHandler(res, 200, message)
        } catch (err) {
            return errorHandler(err, res)
        }
    })

promotions.route('/:promotionId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, async (req, res) => {
        try {
            const { promotionId } = req.params
            const promotion = await Promotions.findById(promotionId)
            if (!promotion) {
                return httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} found!`
            return httpResponseHandler(res, 200, message, promotion)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        const { promotionId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /promotions/${promotionId}`)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { promotionId } = req.params
            const promotionUpdatedParams = req.body
            const updatedPromotion = await Promotions.findByIdAndUpdate(promotionId, {
                $set: promotionUpdatedParams
            }, { new: true })
            if (!updatedPromotion) {
                return httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} updated!`
            return httpResponseHandler(res, 200, message, updatedPromotion)
        } catch (err) {
            return errorHandler(err, res)
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { promotionId } = req.params
            const deletedPromotion = await Promotions.findByIdAndDelete(promotionId)
            if (!deletedPromotion) {
                return httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} deleted!`
            return httpResponseHandler(res, 200, message, deletedPromotion)
        } catch (err) {
            return errorHandler(err, res)
        }
    })

module.exports = promotions