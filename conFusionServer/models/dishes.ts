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
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        required: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
})

export const Dishes = model('Dish', dishSchema)
