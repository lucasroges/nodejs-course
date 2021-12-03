import { MongoClient } from 'mongodb'
import assert from 'assert'

const URL = 'mongodb://localhost:27017/'
const DBNAME = 'conFusion'

MongoClient.connect(URL, (err: any, client: any) => {

    assert.equal(err, null)

    console.log('Successfully connected to the server')

    const db = client.db(DBNAME)
    const collection = db.collection('dishes')

    const doc = {
        "name": "Uthappizza",
        "description": "just a regular pizza"
    }

    collection.insertOne(doc, (err: any, result: any) => {
        assert.equal(err, null)

        console.log(result.acknowledged ? `Data successfully inserted into the collection with _id ${result.insertedId}` : `Error inserting data into the collection`)

        collection.find({}).toArray((err: any, result: any) => {
            assert.equal(err, null)

            console.log(`Found:`)
            console.log(result)

            db.dropCollection('dishes', (err: any, result: any) => {
                assert.equal(err, null)

                client.close()
            })
        })
    })
})
