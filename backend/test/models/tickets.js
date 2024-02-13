// // /**
// //  * Test opening and resetting the database
// //  */

// import { describe, it, before, after } from 'mocha';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import { ObjectId } from 'mongodb';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import database from '../../db/database.js';
// import tickets from '../../models/tickets.js';

// describe('Tickets API', () => {
//     let mongoServer;

//     before(async () => {
//         mongoServer = await MongoMemoryServer.create();
//         process.env.NODE_ENV = 'test';
//     });

//     after(async () => {
//         await mongoServer.stop();
//     });

//     describe('getTickets', () => {
//         it('should get all tickets', async () => {
//             const db = await database.openDb();
//             const collection = db.collection('tickets');
//             const sampleTickets = [{ _id: '1', code: 'ABC' }, { _id: '2', code: 'XYZ' }];

//             sinon.stub(database, 'openDb').resolves(db);
//             sinon.stub(collection, 'find').returns({ toArray: sinon.stub().resolves(sampleTickets) });

//             const req = {};
//             const res = {
//                 json: sinon.stub()
//             };

//             await tickets.getTickets(req, res);

//             expect(res.json.calledWith({ data: sampleTickets })).to.be.true;

//             sinon.restore();
//         });
//     });

//     describe('createTicket', () => {
//         it('should create a new ticket', async () => {
//             const db = await database.openDb();
//             const collection = db.collection('tickets');
//             const newTicket = { _id: '3', code: '123' };

//             sinon.stub(database, 'openDb').resolves(db);
//             sinon.stub(collection, 'insertOne').resolves({});

//             const req = {
//                 body: newTicket
//             };
//             const res = {
//                 json: sinon.stub()
//             };

//             await tickets.createTicket(req, res);

//             expect(res.json.calledWith({ data: newTicket })).to.be.true;

//             sinon.restore();
//         });
//     });

//     describe('updateTicket', () => {
//         it('should update an existing ticket', async () => {
//             const db = await database.openDb();
//             const collection = db.collection('tickets');
//             const updatedTicket = { _id: '1', code: 'XYZ' };

//             sinon.stub(database, 'openDb').resolves(db);
//             sinon.stub(collection, 'updateOne').resolves({ modifiedCount: 1 });

//             const args = { _id: '1', code: 'XYZ' };

//             const result = await tickets.updateTicket(args);

//             expect(result).to.deep.equal(updatedTicket);

//             sinon.restore();
//         });
//     });

//     describe('deleteTicket', () => {
//         it('should delete an existing ticket', async () => {
//             const db = await database.openDb();
//             const collection = db.collection('tickets');
//             const deletedTicket = { _id: '1' };

//             sinon.stub(database, 'openDb').resolves(db);
//             sinon.stub(collection, 'deleteOne').resolves({ deletedCount: 1 });

//             const args = { _id: '1' };

//             const result = await tickets.deleteTicket(args);

//             expect(result).to.deep.equal(deletedTicket);

//             sinon.restore();
//         });
//     });
// });





// // /*global it describe before */

// // process.env.NODE_ENV = 'test';

// // import { should } from 'chai';
// // import database from '../../db/database.js';
// // import tickets from '../../models/tickets.js';

// // should();

// // describe('Test model', () => {
// //     const colName = 'tickets';
// //     /**
// //      * Before test, reset the user database
// //      */

// //     before(async () => {
// //         const db = await database.openDb();

// //         try {
// //             const col = await db.collection(colName);

// //             await col.deleteMany(); // This deletes the data in the collection
// //         } catch (err) {
// //             console.log("During setup following error occured:", err);
// //         } finally {
// //             await db.client.close();
// //         }
// //     });

// //     /**
// //      * Test the model ticketssetup
// //      */
// //     describe('tickets', () => {
// //         // Get tickets, should be empty
// //         it('should return empty array', async () => {
// //             const res = await tickets.getTickets();

// //             res.should.be.a('array');
// //             res.should.have.lengthOf(0);
// //         });

// //         it('should data and array with 1 ticket', async () => {
// //             const inData = {
// //                 code: "ANAtest03",
// //                 trainnumber: "13579",
// //                 traindate: "1984-01-01"
// //             };
// //             const res = await tickets.createTicket(inData);

// //             res.should.be.a('object');
// //             res.should.have.property('_id');
// //             res.code.should.equal('ANAtest03');
// //         });

// //         it('should return array with one item', async () => {
// //             const res = await tickets.getTickets();

// //             res.should.be.a('array');
// //             res.should.have.lengthOf(1);
// //             res[0].should.have.property('_id');
// //             res[0].trainnumber.should.equal('13579');
// //         });

// //         it('should throw TypeError', async () => {
// //             let error;

// //             try {
// //                 await tickets.createTicket();
// //             } catch (e) {
// //                 error = e;
// //             }

// //             error.should.be.an.instanceOf(TypeError);
// //         });
// //     });
// // });
