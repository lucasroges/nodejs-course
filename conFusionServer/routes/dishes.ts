import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { } from 'mongoose'
import { Dishes } from '../models'
import { errorHandler, httpResponseHandler, validationErrorHandler } from '../handlers'

export const dishes = Router()

dishes.use(bodyParser.json())

dishes.route('/')
    .get(async (req: express.Request, res: express.Response) => {
        try {
            const dishes = await Dishes.find({})
            const message = dishes ? `${dishes.length} dishes found!` : 'No dishes found!'
            const response = {
                message,
                dishes
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
            const dish = req.body
            const createdDish = await Dishes.create(dish)
            const message = `Dish ${dish.name} was created!`
            const response = {
                message,
                createdDish
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
        res.end('PUT operation not supported on /dishes')
    })
    .delete(async (req: express.Request, res: express.Response) => {
        try {
            const deletedDishes = await Dishes.deleteMany({})
            const message = deletedDishes.deletedCount ? `${deletedDishes.deletedCount} dishes deleted!` : 'No dishes deleted!'
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

dishes.route('/:dishId')
    .get(async (req: express.Request, res: express.Response) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const message = `Dish ${dishId} found!`
            const response = {
                message,
                dish
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req: express.Request, res: express.Response) => {
        const { dishId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${dishId}`)
    })
    .put(async (req: express.Request, res: express.Response) => {
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
            const response = {
                message,
                updatedDish
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(async (req: express.Request, res: express.Response) => {
        try {
            const { dishId } = req.params
            const deletedDish = await Dishes.findByIdAndDelete(dishId)
            if (!deletedDish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const message = `Dish ${dishId} deleted!`
            const response = {
                message
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })

dishes.route('/:dishId/comments')
    .get(async (req: express.Request, res: express.Response) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            const comments = dish.comments
            const message = `Dish ${dishId} found with ${comments.length} comments!`
            const response = {
                message,
                comments
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post(async (req: express.Request, res: express.Response) => {
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
            const response = {
                message,
                updatedDish
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(response)
        } catch (err: any) {
            (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : errorHandler(err, res)
        }
    })
    .put(async (req: express.Request, res: express.Response) => {
        const { dishId } = req.params
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes/${dishId}/comments`)
    })
    .delete(async (req: express.Request, res: express.Response) => {
        try {
            const { dishId } = req.params
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                httpResponseHandler(res, 404, `Dish ${dishId} not found!`)
            }
            dish.comments = []
            const updatedDish = await dish.save()
            const message = `Dish ${dishId} was updated!`
            const response = {
                message,
                updatedDish
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })

dishes.route('/:dishId/comments/:commentId')
    .get(async (req: express.Request, res: express.Response) => {
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
            const response = {
                message,
                comment
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req: express.Request, res: express.Response) => {
        const { dishId, commentId } = req.params
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${dishId}/comments/${commentId}`)
    })
    .put(async (req: express.Request, res: express.Response) => {
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
            const response = {
                message,
                updatedDish
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .delete(async (req: express.Request, res: express.Response) => {
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
            const response = {
                message,
                updatedDish
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })