const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    }
}).plugin(passportLocalMongoose)

const Users = mongoose.model('User', userSchema)

module.exports = Users