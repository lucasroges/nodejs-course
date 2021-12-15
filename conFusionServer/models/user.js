const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

/*
const userSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    }
}).plugin(passportLocalMongoose)
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})

const Users = mongoose.model('User', userSchema)

module.exports = Users