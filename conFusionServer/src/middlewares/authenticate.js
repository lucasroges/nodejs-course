const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const FacebookTokenStrategy = require('passport-facebook-token')
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()

const { Users } = require('../models/user')

const httpResponseHandler = require('../utils/httpResponseHandler')

exports.local = passport.use(new localStrategy(Users.authenticate()))
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

const secretKey = process.env.SECRET_KEY

exports.getToken = (user) => jwt.sign(user, secretKey, { expiresIn: 3600 })

const opt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
}

const verify = async (jwt_payload, done) => {

    const { _id } = jwt_payload

    const user = await Users.findOne({ _id })

    if (!user) {
        return done(null, false)
    }

    return done(null, user)
}

exports.jwtPassport = passport.use(new JwtStrategy(opt, verify))

exports.verifyUser = passport.authenticate('jwt', { session: false })

exports.verifyAdmin = (req, res, next) => {
    const { user } = req

    if (!user || !user.admin) {
        return httpResponseHandler(res, 403, 'Operation not allowed!')
    }

    return next()
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName } = profile
    const user = await Users.findOne({ facebookId: id})

    if (!user) {
        const { givenName, familyName } = profile.name
        const newUser = await new Users({
            username: displayName,
            facebookId: id,
            firstName: givenName,
            lastName: familyName
        }).save()

        if (!newUser) {
            return done('Error creating new user', false)
        }
        
        return done(null, newUser)
    }

    return done(null, user)
}))
