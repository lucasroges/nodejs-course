import { model, Schema } from 'mongoose'

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const Dishes = model('Dish', dishSchema)