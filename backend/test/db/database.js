import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { MongoMemoryServer } from 'mongodb-memory-server';
import database from '../../db/database.js';

describe('Database Functions', () => {
    let mongoServer;

    before(async () => {
        // Start an in-memory MongoDB server
        mongoServer = await MongoMemoryServer.create();
        // Set environment variables
        process.env.ATLAS_USERNAME = 'glopet4559';
        process.env.ATLAS_PASSWORD = '9Yjx6Qf64dDKEbUr';
        process.env.NODE_ENV = 'test';
    });

    after(async () => {
        // Stop the in-memory MongoDB server
        await mongoServer.stop();
    });

    describe('openDb', () => {
        it('should open a database connection', async () => {
            const db = await database.openDb();
            expect(db).to.exist;
            expect(db.databaseName).to.equal('test'); // Assuming you are using 'test' as the test database
            await db.client.close();
        });

        it('should handle errors during connection', async () => {
            // Mocking the MongoClient to throw an error
            sinon.stub(database, 'openDb').throws(new Error('Connection error'));

            try {
                await database.openDb();
            } catch (error) {
                expect(error).to.be.an.instanceOf(Error);
                expect(error.message).to.equal('Connection error');
            } finally {
                sinon.restore();
            }
        });
    });

    // describe('getCollection', () => {
    //     it('should get a collection from the database', async () => {
    //         const db = await database.openDb();
    //         const colName = 'your-collection-name';
    //         const data = [{ name: 'document1' }, { name: 'document2' }];

    //         // Insert test data
    //         await db.collection(colName).insertMany(data);

    //         const result = await database.getCollection(colName);

    //         expect(result).to.deep.equal(data);
    //         await db.client.close();
    //     });

    //     it('should handle errors during collection retrieval', async () => {
    //         const colName = 'your-collection-name';

    //         // Mocking the db.collection() method to throw an error
    //         sinon.stub(database, 'getCollection').throws(new Error('Collection retrieval error'));

    //         try {
    //             await database.getCollection(colName);
    //         } catch (error) {
    //             expect(error).to.be.an.instanceOf(Error);
    //             expect(error.message).to.equal('Collection retrieval error');
    //         } finally {
    //             sinon.restore();
    //         }
    //     });
    // });
});



// /**
//  * Test opening and resetting the database
//  */

// /*global it describe before */

// process.env.NODE_ENV = 'test';

// import { should } from 'chai';
// import database from '../../db/database.js';
// import resetCollection from '../../db/setup.js';

// should();

// describe('Test database', () => {
//     /**
//      * Before test, reset the database and remove all collections
//      */
//     before(async () => {
//         const db = await database.openDb();

//         try {
//             const collections = await db.listCollections().toArray();

//             for (const col of collections) {
//                 await db.collection(col.name).drop();
//             }
//         } catch (err) {
//             console.log("During setup following error occured:", err);
//         } finally {
//             await db.client.close();
//         }
//     });

//     /**
//      * Test the database setup function. Maybe this could be removed or moved but
//      * it's good to have a way to easy reset a collection while still in develop-mode that
//      * is separated from the database.js file.
//      */
//     describe('Test reset function', () => {
//         const colName = "testCol";

//         // Resets the collection
//         it('should return empty array', async () => {
//             await resetCollection(colName);

//             const res = await database.getCollection(colName);

//             res.should.be.a('array');
//             res.should.have.lengthOf(0);
//         });

//         // Simulates using an JSON-file as inputdata
//         it('should return 2 documents', async () => {
//             // Using an array to simulate documents from a JSON-file.
//             const doc = [
//                 {
//                     "name": "first document"
//                 },
//                 {
//                     "name": "second document"
//                 }
//             ];

//             await resetCollection(colName, doc);

//             const res = await database.getCollection(colName, doc);

//             res.should.be.a('array');
//             res.should.have.lengthOf(2);
//             res[0].should.have.property("name");
//             res[1].should.have.property("name");
//         });

//         // Resets the collection again
//         it('should return empty array', async () => {
//             await resetCollection(colName);

//             const res = await database.getCollection(colName);

//             res.should.be.a('array');
//             res.should.have.lengthOf(0);
//         });
//     });
// });
