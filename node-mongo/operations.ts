import assert from 'assert'
import { MongoClient, Db } from 'mongodb'

export const insertDocument = async (db: Db, collection: string, document: object): Promise<any> => {
    const coll = await db.collection(collection)

    const insertedDocument = await coll.insertOne(document)
    return insertedDocument
}

export const findDocuments = async (db: Db, collection: string): Promise<any> => {
    const coll = await db.collection(collection)

    const documents = await coll.find({}).toArray()
    return documents
}

export const removeDocument = async (db: Db, collection: string, document: object): Promise<any> => {
    const coll = await db.collection(collection)

    const deletedDocument = await coll.deleteOne(document)
    return deletedDocument
}

export const updateDocument = async (db: Db, collection: string, document: object, newDocument: object): Promise<any> => {
    const coll = await db.collection(collection)

    const updatedDocument = await coll.findOneAndUpdate(document, { $set: newDocument })
    return updatedDocument
}