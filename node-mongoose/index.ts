import { connect } from 'mongoose'
import { Dishes } from './models/dishes'

const DB = 'conFusion'
const URL = `mongodb://localhost:27017/${DB}`


const connection = connect(URL)

connection.then((db) => {
    console.log(`Successfully connected to ${URL}`)

    const newDish = new Dishes({
        name: 'Caesar Salad',
        description: 'A healthy dish'
    })

    newDish.save()
        .then((dish: any) => {
            console.log(dish)
        }).catch((err: Error) => {
            throw new Error(`Error adding to database: ${err.name}`)
        })
}).catch((err: Error) => {
    throw new Error(`Error connecting to database: ${err.name}`)
})

