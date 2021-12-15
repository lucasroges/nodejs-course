const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const User = require('./models/user')
const config = require('./config')

exports.local = passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => jwt.sign(user, config.secretKey, { expiresIn: 3600 })

const opt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}

const verify = async (jwt_payload, done) => {

    const { _id } = jwt_payload

    const user = await User.findOne({ _id })

    if (!user) {
        return done(null, false)
    }

    return done(null, user)
}

exports.jwtPassport = passport.use(new JwtStrategy(opt, verify))

exports.verifyUser = passport.authenticate('jwt', { session: false })
