import { MongoClient } from 'mongodb'
import assert from 'assert'
import { insertDocument, findDocuments, removeDocument, updateDocument } from './operations'

const URL = 'mongodb://localhost:27017/'
const DBNAME = 'conFusion'

MongoClient.connect(URL, (err: any, client: any) => {

    assert.equal(err, null)

    console.log('Successfully connected to the server')

    const db = client.db(DBNAME)

    const doc = {
        "name": "Mozzarella Pizza",
        "description": "Cheese pizza"
    }

    insertDocument(db, 'dishes', doc, (result: any) => {
        console.log(result)

        client.close()
    })

})
