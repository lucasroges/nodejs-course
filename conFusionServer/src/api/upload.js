const bodyParser = require('body-parser')
const express = require('express')
const multer = require('multer')

const cors = require('../middlewares/cors')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const imageFileRegExp = new RegExp('\.(jpg|jpeg|png|gif)$')
    if(!file.originalname.match(imageFileRegExp)) {
        const error = new Error('You can upload only image files!')
        return cb(error, false)
    }
    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter
})

const httpResponseHandler = require('../utils/httpResponseHandler')

const authenticate = require('../middlewares/authenticate')

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, async (req, res) => {
        return httpResponseHandler(res, 403, 'GET operation not supported on /upload')
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), async (req, res) => {
        try {
            const { file } = req
            const message = `File successfully uploaded!`
            return httpResponseHandler(res, 200, message, { file })
        } catch (err) {
            return httpResponseHandler(res, 500, 'Internal Server Error', {}, err)
        }
    })
    .put(cors.corsWithOptions, (req, res) => {
        return httpResponseHandler(res, 403, 'PUT operation not supported on /upload')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res) => {
        return httpResponseHandler(res, 403, 'DELETE operation not supported on /upload')
    })

module.exports = uploadRouter