import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { } from 'mongoose'
import { Dishes } from '../models'
import { errorHandler, notFoundHandler, validationErrorHandler } from '../handler'

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
            const dishId = req.params.dishId
            const dish = await Dishes.findById(dishId)
            if (!dish) {
                notFoundHandler(dishId, res)
            }
            const message = `Dish ${dishId} found!`
            const response = {
                message,
                dishes
            }
            res.statusCode = 200
            res.json(response)
        } catch (err) {
            errorHandler(err, res)
        }
    })
    .post((req: express.Request, res: express.Response) => {
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
    })
    .put(async (req: express.Request, res: express.Response) => {
        try {
            const dishId = req.params.dishId
            const dishUpdatedParams = req.body
            const updatedDish = await Dishes.findByIdAndUpdate(dishId, {
                $set: dishUpdatedParams
            }, { new: true })
            if (!updatedDish) {
                notFoundHandler(dishId, res)
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
            const dishId = req.params.dishId
            const deletedDish = await Dishes.findByIdAndDelete(dishId)
            if (!deletedDish) {
                notFoundHandler(dishId, res)
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