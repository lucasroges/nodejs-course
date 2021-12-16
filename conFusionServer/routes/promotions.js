const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const Promotions = require('../models/promotions')

const errorHandler = require('../handlers/errorHandler')
const validationErrorHandler = require('../handlers/validationErrorHandler')
const httpResponseHandler = require('../handlers/httpResponseHandler')

const authenticate = require('../authenticate')

const promotions = express.Router()

promotions.use(bodyParser.json())

promotions.route('/')
    .get(async (req, res) => {
        try {
            const promotions = await Promotions.find({})
            const message = promotions ? `${promotions.length} promotions found!` : 'No promotions found!'
            httpResponseHandler(res, 200, message, promotions)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const promotion = req.body
            const createdPromotion = await Promotions.create(promotion)
            const message = `Promotion ${promotion.name} was created!`
            httpResponseHandler(res, 200, message, createdPromotion)
        } catch (err) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /promotions')
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const deletedPromotions = await Promotions.deleteMany({})
            const message = deletedPromotions.deletedCount ? `${deletedPromotions.deletedCount} promotions deleted!` : 'No promotions deleted!'
            httpResponseHandler(res, 200, message)
        } catch (err) {
            errorHandler(err, res)
        }
    })

promotions.route('/:promotionId')
    .get(async (req, res) => {
        try {
            const { promotionId } = req.params
            const promotion = await Promotions.findById(promotionId)
            if (!promotion) {
                httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} found!`
            httpResponseHandler(res, 200, message, promotion)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req, res) => {
        const { promotionId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /promotions/${promotionId}`)
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { promotionId } = req.params
            const promotionUpdatedParams = req.body
            const updatedPromotion = await Promotions.findByIdAndUpdate(promotionId, {
                $set: promotionUpdatedParams
            }, { new: true })
            if (!updatedPromotion) {
                httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} updated!`
            httpResponseHandler(res, 200, message, updatedPromotion)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        try {
            const { promotionId } = req.params
            const deletedPromotion = await Promotions.findByIdAndDelete(promotionId)
            if (!deletedPromotion) {
                httpResponseHandler(res, 404, `Promotion ${promotionId} not found!`)
            }
            const message = `Promotion ${promotionId} deleted!`
            httpResponseHandler(res, 200, message, deletedPromotion)
        } catch (err) {
            errorHandler(err, res)
        }
    })

module.exports = promotions