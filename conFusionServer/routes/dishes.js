const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const Dishes = require('../models/dishes')

const errorHandler = require('../handlers/errorHandler')
const validationErrorHandler = require('../handlers/validationErrorHandler')
const httpResponseHandler = require('../handlers/httpResponseHandler')

const authenticate = require('../authenticate')

const dishes = express.Router()

dishes.use(bodyParser.json())

dishes.route('/')
    .get(async (req, res) => {
        try {
            const dishes = await Dishes.find({})
            const message = dishes ? `${dishes.length} dishes found!` : 'No dishes found!'
            httpResponseHandler(res, 200, message, dishes)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post(authenticate.verifyUser, async (req, res) => {
        try {
            const dish = req.body
            const createdDish = await Dishes.create(dish)
            const message = `Dish ${dish.name} was created!`
            httpResponseHandler(res, 200, message, createdDish)
        } catch (err) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /dishes')
    })
    .delete(authenticate.verifyUser, async (req, res) => {
        try {
            const deletedDishes = await Dishes.deleteMany({})
            const message = deletedDishes.deletedCount ? `${deletedDishes.deletedCount} dishes deleted!` : 'No dishes deleted!'
            httpResponseHandler(res, 200, message)
        } catch (err) {
            errorHandler(err, res)
        }
    })

dishes.route('/:dishId')
    .get(async (req, res) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const message = `Dish ${dishId} found!`
            httpResponseHandler(res, 200, message, dish)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req, res) => {
        const { dishId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${dishId}`)
    })
    .put(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId } = req.params
            const dishUpdatedParams = req.body
            const updatedDish = await Dishes.findByIdAndUpdate(dishId, {
                $set: dishUpdatedParams
            }, { new: true })
            if (!updatedDish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const message = `Dish ${dishId} updated!`
            httpResponseHandler(res, 200, message, updatedDish)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId } = req.params
            const deletedDish = await Dishes.findByIdAndDelete(dishId)
            if (!deletedDish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const message = `Dish ${dishId} deleted!`
            httpResponseHandler(res, 200, message, deletedDish)
        } catch (err) {
            errorHandler(err, res)
        }
    })

dishes.route('/:dishId/comments')
    .get(async (req, res) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comments = dish.comments
            const message = `Dish ${dishId} found with ${comments.length} comments!`
            httpResponseHandler(res, 200, message, comments)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comment = req.body
            dish.comments.push(comment)
            const updatedDish = await dish.save()
            const message = `Dish ${dishId} was updated!`
            httpResponseHandler(res, 200, message, updatedDish)
        } catch (err) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put(async (req, res) => {
        const { dishId } = req.params
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes/${dishId}/comments`)
    })
    .delete(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            dish.comments = []
            const updatedDish = await dish.save()
            const message = `Dish ${dishId} was updated!`
            httpResponseHandler(res, 200, message, updatedDish)
        } catch (err) {
            errorHandler(err, res)
        }
    })

dishes.route('/:dishId/comments/:commentId')
    .get(async (req, res) => {
        try {
            const { dishId, commentId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comment = dish.comments.if(commentId)
            if (!comment) {
                httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
            }
            const message = `Comment ${comment} inside dish ${dishId} found!`
            httpResponseHandler(res, 200, message, comment)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req, res) => {
        const { dishId, commentId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${dishId}/comments/${commentId}`)
    })
    .put(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId, commentId } = req.params
            const dish = await Dishes.findByIdAndUpdate(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comment = dish.comments.id(commentId)
            if (!comment) {
                httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
            }
            if (req.body.rating) {
                dish.comments.id(commentId).rating = req.body.rating
            }
            if (req.body.comment) {
                dish.comments.id(commentId).comment = req.body.comment
            }
            const updatedDish = await dish.save()
            const message = `Dish ${dishId} and comment ${commentId} updated!`
            httpResponseHandler(res, 200, message, updatedDish)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(authenticate.verifyUser, async (req, res) => {
        try {
            const { dishId, commentId } = req.params
            const dish = await Dishes.findByIdAndUpdate(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comment = dish.comments.id(commentId)
            if (!comment) {
                httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
            }
            dish.comments.id(commentId).remove()
            const updatedDish = await dish.save()
            const message = `Comment ${commentId} from dish ${dishId} deleted!`
            httpResponseHandler(res, 200, message, updatedDish)
        } catch (err) {
            errorHandler(err, res)
        }
    })

module.exports = dishes