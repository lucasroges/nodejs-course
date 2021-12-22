const bodyParser = require('body-parser')
const express = require('express')

const { Dishes } = require('../models/dishes')

const validationErrorHandler = require('../utils/validationErrorHandler')
const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../middlewares/authenticate')

const cors = require('../middlewares/cors')

const dishesRouter = express.Router()

dishesRouter.use(bodyParser.json())

dishesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => {
    try {
        const dishes = await Dishes.find({}).populate('comments.author')
        const message = dishes ? `${dishes.length} dishes found!` : 'No dishes found!'
        return httpResponseHandler(res, 200, message, dishes)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const dish = req.body
        const createdDish = await Dishes.create(dish)
        const message = `Dish ${dish.name} was created!`
        return httpResponseHandler(res, 200, message, createdDish)
    } catch (err) {
        return (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.put(cors.corsWithOptions, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const deletedDishes = await Dishes.deleteMany({})
        const message = deletedDishes.deletedCount ? `${deletedDishes.deletedCount} dishes deleted!` : 'No dishes deleted!'
        return httpResponseHandler(res, 200, message)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

dishesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => {
    try {
        const { dishId } = req.params
        const dish = await Dishes.findById(dishId).populate('comments.author')
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const message = `Dish ${dishId} found!`
        return httpResponseHandler(res, 200, message, dish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, (req, res) => {
    const { dishId } = req.params
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${dishId}`)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const { dishId } = req.params
        const dishUpdatedParams = req.body
        const updatedDish = await Dishes.findByIdAndUpdate(dishId, {
            $set: dishUpdatedParams
        }, { new: true })
        if (!updatedDish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const message = `Dish ${dishId} updated!`
        return httpResponseHandler(res, 200, message, updatedDish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const { dishId } = req.params
        const deletedDish = await Dishes.findByIdAndDelete(dishId)
        if (!deletedDish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const message = `Dish ${dishId} deleted!`
        return httpResponseHandler(res, 200, message, deletedDish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

dishesRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => {
    try {
        const { dishId } = req.params
        const dish = await Dishes.findById(dishId).populate('comments.author')
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const comments = dish.comments
        const message = `Dish ${dishId} found with ${comments.length} comments!`
        return httpResponseHandler(res, 200, message, comments)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { dishId } = req.params
        const dish = await Dishes.findById(dishId)
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const { _id } = req.user
        const author = _id
        const comment = { ...req.body, author }
        dish.comments.push(comment)
        const updatedDish = await dish.save()
        const message = `Dish ${dishId} was updated!`
        return httpResponseHandler(res, 200, message, updatedDish)
    } catch (err) {
        return (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.put(cors.corsWithOptions, async (req, res) => {
    const { dishId } = req.params
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes/${dishId}/comments`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
    try {
        const { dishId } = req.params
        const dish = await Dishes.findById(dishId)
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        dish.comments = []
        const updatedDish = await dish.save()
        const message = `Dish ${dishId} was updated!`
        return httpResponseHandler(res, 200, message, updatedDish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

dishesRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => {
    try {
        const { dishId, commentId } = req.params
        const dish = await Dishes.findById(dishId).populate('comments.author')
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const comment = dish.comments.if(commentId)
        if (!comment) {
            return httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
        }
        const message = `Comment ${comment} inside dish ${dishId} found!`
        return httpResponseHandler(res, 200, message, comment)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, (req, res) => {
    const { dishId, commentId } = req.params
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${dishId}/comments/${commentId}`)
})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const { dishId, commentId } = req.params
        const dish = await Dishes.findById(dishId)
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const comment = dish.comments.id(commentId)
        if (!comment) {
            return httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
        }
        if (!comment.author.equals(_id)) {
            return httpResponseHandler(res, 403, `Not allowed to edit comment ${commentId}`)
        }
        if (req.body.rating) {
            dish.comments.id(commentId).rating = req.body.rating
        }
        if (req.body.comment) {
            dish.comments.id(commentId).comment = req.body.comment
        }
        const updatedDish = await dish.save()
        const message = `Dish ${dishId} and comment ${commentId} updated!`
        return httpResponseHandler(res, 200, message, updatedDish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const { dishId, commentId } = req.params
        const dish = await Dishes.findByIdAndUpdate(dishId)
        if (!dish) {
            return httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
        }
        const comment = dish.comments.id(commentId)
        if (!comment) {
            return httpResponseHandler(res, 404, `Comment ${commentId} not found!`)
        }
        if (!comment.author.equals(_id)) {
            return httpResponseHandler(res, 403, `Not allowed to delete comment ${commentId}`)
        }
        dish.comments.id(commentId).remove()
        const updatedDish = await dish.save()
        const message = `Comment ${commentId} from dish ${dishId} deleted!`
        return httpResponseHandler(res, 200, message, updatedDish)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

module.exports = dishesRouter