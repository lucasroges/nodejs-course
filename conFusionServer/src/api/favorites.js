const bodyParser = require('body-parser')
const express = require('express')

const Favorites = require('../models/favorites')
const { Dishes } = require('../models/dishes')

const validationErrorHandler = require('../utils/validationErrorHandler')
const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../middlewares/authenticate')

const cors = require('../middlewares/cors')

const favoritesRouter = express.Router()

favoritesRouter.use(bodyParser.json())

favoritesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const favorites = await Favorites.findOne({ user: _id }).populate('user').populate('dishes')
        const message = favorites ? 'Favorites found!' : 'No favorites found!'
        return httpResponseHandler(res, 200, message, favorites)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const newFavorites = req.body
        const favorites = await Favorites.findOne({ user: _id })
        if (!favorites) {
            const user = _id
            const dishes = (await Promise.all(newFavorites.map(async ({ _id }) => await Dishes.findOne({ _id })))).filter((dish) => dish !== null).map((dish) => { console.log(dish); return dish._id})
            const favorite = await Favorites.create({ user, dishes })
            if (!favorite) {
                return httpResponseHandler(res, 500, 'Error creating favorites')
            }
            return httpResponseHandler(res, 200, 'Favorite successfully created!', favorite)
        }
        const { dishes } = favorites
        const newDishes = await Promise.all(newFavorites.map(async (_id) => await Dishes.findOne({ _id })).filter((dish) => dish !== null).map((dish) => dish._id))
        favorites.dishes = [...dishes, ...newDishes]
        const updatedFavorites = await favorites.save()
        return httpResponseHandler(res, 200, 'Favorite successfully updated!', updatedFavorites)
    } catch (err) {
        return (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.put(cors.corsWithOptions, (req, res) => httpResponseHandler(res, 403, 'PUT operation not supported on /favorites'))
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const deletedFavorite = await Favorites.deleteOne({ user: _id })
        if (!deletedFavorite.deletedCount) {
            return httpResponseHandler(res, 400, 'No favorites to delete!')
        }
        return httpResponseHandler(res, 200, 'Favorites successfully deleted!')
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})
.get(cors.cors, async (req, res) => httpResponseHandler(res, 403, 'GET operation not supported on /favorites/dishId'))
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const { dishId } = req.params
        const dish = await Dishes.findOne({ _id: dishId })
        if (!dish) {
            return httpResponseHandler(res, 400, `Dish with id ${dishId} does not exist!`)
        }
        const favorites = await Favorites.findOne({ user: _id })
        if (!favorites) {
            const user = _id
            const favorite = await Favorites.create({ user, dishes: [dishId] })
            if (!favorite) {
                return httpResponseHandler(res, 500, 'Error creating favorites')
            }
            return httpResponseHandler(res, 200, 'Favorite successfully created!', favorite)
        }
        const { dishes } = favorites
        console.log(dishes)
        console.log(dishId)
        favorites.dishes = [...dishes, dishId]
        const updatedFavorites = await favorites.save()
        return httpResponseHandler(res, 200, 'Favorite successfully updated!', updatedFavorites)
    } catch (err) {
        return (err.message && err.message.includes('validation failed')) ? validationErrorHandler(err, res) : httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})
.put(cors.corsWithOptions, (req, res) => httpResponseHandler(res, 403, 'PUT operation not supported on /favorites/dishId'))
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        const { _id } = req.user
        const { dishId } = req.params
        console.log(dishId)
        const userFavoritesUpdated = await Favorites.findOneAndUpdate({ user: _id }, { $pull: { dishes: { _id: dishId } } })
        console.log(userFavoritesUpdated)
        return httpResponseHandler(res, 200, 'Favorites successfully updated!', userFavoritesUpdated)
    } catch (err) {
        return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
    }
})

module.exports = favoritesRouter