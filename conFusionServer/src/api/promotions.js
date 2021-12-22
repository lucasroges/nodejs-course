const bodyParser = require('body-parser')
const express = require('express')

const Promotions = require('../models/promotions')

const validationErrorHandler = require('../utils/validationErrorHandler')
const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../middlewares/authenticate')

const cors = require('../middlewares/cors')

const promotionsRouter = express.Router()

promotionsRouter.use(bodyParser.json())

promotionsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => {
    try {
        const promotions = await Promotions.find({})
        const message = promotions ? `${promotions.length} promotions found!` : 'No promotions found!'
        return httpResponseHandler(res, 200, message, promotions)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const promotion = req.body
        const createdPromotion = await Promotions.create(promotion)
        const message = `Promotion ${promotion.name} was created!`
        return httpResponseHandler(res, 200, message, createdPromotion)
    } catch (err) {
        return (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
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
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

promotionsRouter.route('/:promotionId')
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
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
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
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
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
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

module.exports = promotionsRouter