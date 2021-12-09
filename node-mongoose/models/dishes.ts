import { model, Schema } from 'mongoose'

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
    }
})

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
}, {
    timestamps: true
})

export const Dishes = model('Dish', dishSchema)
