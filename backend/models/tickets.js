import database from '../db/database.js';
import { ObjectId } from 'mongodb';
const collectionName = "tickets";
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const tickets = {
    getTickets: async function getTickets(req, res) {
        // Access a MongoClient object
        const db = await database.openDb();

        // Get the collection object
        const collection = db.collection(collectionName);

        // Get all documents (tickets) in the collection (trains)
        let allTickets = await collection.find().toArray();

        // Close the database connection
        await db.client.close();

        // Print all documents to the console
        console.log(allTickets);
        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(args) {
        const db = await database.openDb();
        const collection = await db.collection(collectionName);
        // Create a new ObjectId for the new document
        const newId = new ObjectId();

        const result = await collection.insertOne({
            _id: newId,
            code: args.code,
            trainnumber: args.trainnumber,
            traindate: args.traindate
        });

        await db.client.close();

        // Here we return the string of the ObjectId but alternatives are available
        // https://www.mongodb.com/docs/manual/reference/method/ObjectId/#ObjectId
        return result.json({
            _id: newId.toString(),
            code: args.code,
            trainnumber: args.trainnumber,
            traindate: args.traindate,
        });
    }
};

export default tickets;
