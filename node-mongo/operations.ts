import assert from 'assert'
import { MongoClient, Db } from 'mongodb'

export const insertDocument = (db: Db, collection: string, document: object, callback: Function) => {
    const coll = db.collection(collection)

    coll.insertOne(document, (err: any, result: any) => {
        assert.equal(err, null)
        
        console.log(`Inserted with _id ${result.insertedId}`)
        callback(result)
    })
}

export const findDocuments = (db: Db, collection: string, callback: Function) => {
    const coll = db.collection(collection)
    
    coll.find({}).toArray((err: any, documents: any) => {
        assert.equal(err, null)

        callback(documents)
    })

}

export const removeDocument = (db: Db, collection: string, document: object, callback: Function) => {
    const coll = db.collection(collection)

    coll.deleteOne(document, (err: any, result: any) => {
        assert.equal(err, null)

        console.log(`Removed the document ${document}`)
        callback(result)
    })
}

export const updateDocument = (db: Db, collection: string, document: object, updatedDocument: object, callback: Function) => {
    const coll = db.collection(collection)

    coll.updateOne(document, {}, {}, (err: any, result: any) => {
        assert.equal(err, null)
        
        callback(result)
    })
}