import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        default: false
    }
})

export const Users = model('User', userSchema)