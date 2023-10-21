/**
 * Connect to the database and setup it with some default data.
 */
"use strict";

import database from '../db/database';

// Do it.
resetCollection("tickets");

/**
 * Reset a collection by removing existing content.
 * Can also be used to insert a default set of documents.
 *
 * @async
 *
 * @param {string} colName Name of collection.
 * @param {object=} doc    Optional, documents to be inserted into collection in JSON-format.
 *
 * @return {Promise<void>} Void
 */
async function resetCollection(colName, doc=null) {
    try {
        const db = await database.openDb();
        const col = await db.collection(colName);

        await col.deleteMany(); // This deletes the data in the collection

        // Insert default data if provied as JSON-string
        if (doc) {
            await col.insertMany(doc);
        }

        await db.client.close();
    } catch (err) {
        console.log(err);
    }
}

// module.exports = resetCollection;
export default resetCollection;
