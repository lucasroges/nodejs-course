import { MongoClient } from 'mongodb'
import assert from 'assert'
import { insertDocument, findDocuments, removeDocument, updateDocument } from './operations'

const URL = 'mongodb://localhost:27017/'
const DBNAME = 'conFusion'

MongoClient.connect(URL, async (err: any, client: any) => {

    assert.equal(err, null)

    console.log('Successfully connected to the server')

    const db = client.db(DBNAME)
    const collection = 'dishes'
    const doc = {
        "name": "Veggie Pizza",
        "description": "Colorful pizza"
    }

    const insertedDocument = await insertDocument(db, collection, doc)

    console.log(`Inserted document ${insertedDocument.insertedId} into ${collection} collection`)

    client.close()

})
