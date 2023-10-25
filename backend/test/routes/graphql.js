/**
 * Test the route /graphql
 */

/*global it describe before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const database = require('../../db/database.js');
const httpServer = require('../../app.js');
const ticketsModel = require('../../models/tickets.js');

chai.should();

chai.use(chaiHttp);

/**
 * Test the route /graphql. Checking that the properties used in front-end exists.
 */
describe('route /graphql', () => {
    /**
     * Before test, reset the collection
     */
    before(async () => {
        const db = await database.openDb();

        try {
            const colTickets = await db.collection('tickets');
            const colUsers = await db.collection('users');

            await colTickets.deleteMany(); // This deletes the data in the collection
            await colUsers.deleteMany(); // This deletes the data in the collection
        } catch (err) {
            console.log("During setup following error occured:", err);
        } finally {
            await db.client.close();
        }
    });

    describe('tickets', () => {
        const query = `{
            tickets {
                _id
                code
                trainnumber
                traindate
            }
        }`;
        let ticketId = null;

        // Test to see collection is actually empty
        it('query should get status 200 with empty array in data', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: query})
                .end((err, res) => {
                    const tickets = res.body.data.tickets;

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('tickets');
                    tickets.should.be.a('array');
                    tickets.should.have.lengthOf(0);
                    done();
                });
        });

        // Test to insert ticket without logging in
        it('mutation should not succeed since not logged in', (done) => {
            const mutation = `mutation {
                createTicket(
                    code: "ALATEST01"
                    trainnumber: "12345"
                    traindate: "2020-02-20"
                ) {
                    _id
                    code
                    trainnumber
                    traindate
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200); // This is set by graphql
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('message');
                    res.body.errors[0].message.should.include('Not authenticated.');

                    done();
                });
        });

        // Test to control collection is still empty
        it('query should get status 200 with empty array in data', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: query})
                .end((err, res) => {
                    const tickets = res.body.data.tickets;

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('tickets');
                    tickets.should.be.a('array');
                    tickets.should.have.lengthOf(0);
                    done();
                });
        });


        // Test to add ticket with wrong x-access-token
        it('mutation should not succeed since access token is wrong', (done) => {
            const mutation = `mutation {
                createTicket(
                    code: "ALATESTNOT"
                    trainnumber: "125345"
                    traindate: "2020-02-20"
                ) {
                    _id
                    code
                    trainnumber
                    traindate
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('x-access-token', 'notaccorecttoken')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200); // This is set by graphql
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('message');
                    res.body.errors[0].message.should.include('Not authenticated.');

                    done();
                });
        });

        // Test to add ticket with stub answer from jwt.verify
        it('mutation should succeed since logged in', (done) => {
            const mutation = `mutation {
                createTicket(
                    code: "ALATEST01"
                    trainnumber: "12345"
                    traindate: "2020-02-20"
                ) {
                    _id
                    code
                    trainnumber
                    traindate
                }
            }`;

            // Stub the jwt.verify function to always return a successful verification
            const jwtStub = sinon.stub(jwt, 'verify').callsFake(() => {
                return {
                    email: "mockedEmail@example.com"
                };
            });

            chai.request(httpServer)
                .post('/graphql')
                .set('x-access-token', 'onlyneededtomakeauthModelusejwtverify')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    const ticket = res.body.data.createTicket;

                    res.should.have.status(200);
                    ticket.should.be.a('object');
                    ticket.should.have.property('_id');
                    ticket.code.should.equal('ALATEST01');
                    ticket.trainnumber.should.equal('12345');
                    ticket.traindate.should.equal('2020-02-20');

                    jwtStub.restore();
                    done();
                });
        });

        // Test to see if the ticket was added
        it('query should get status 200 with array and one item', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: query})
                .end((err, res) => {
                    const tickets = res.body.data.tickets;

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('tickets');
                    tickets.should.be.a('array');
                    tickets.should.have.lengthOf(1);
                    tickets[0].code.should.equal('ALATEST01');
                    done();
                });
        });

        // Second test with a mocked logged in person
        it('mutation should succeed since logged in', (done) => {
            const mutation = `mutation {
                createTicket(
                    code: "ALATEST02"
                    trainnumber: "67890"
                    traindate: "2022-02-20"
                ) {
                    _id
                    code
                    trainnumber
                    traindate
                }
            }`;

            // Stub the jwt.verify function to always return a successful verification
            const jwtStub = sinon.stub(jwt, 'verify').callsFake(() => {
                return {
                    email: "mockedEmail@example.com"
                };
            });

            chai.request(httpServer)
                .post('/graphql')
                .set('x-access-token', 'onlyneededtomakeauthModelusejwtverify')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    const ticket = res.body.data.createTicket;

                    res.should.have.status(200);
                    ticket.should.be.a('object');
                    ticket.should.have.property('_id');
                    ticket.code.should.equal('ALATEST02');
                    ticket.trainnumber.should.equal('67890');
                    ticket.traindate.should.equal('2022-02-20');

                    jwtStub.restore();

                    // Set for easier access in update/delete tests
                    ticketId = ticket._id
                    done();
                });
        });

        // See that there a two tickets in the array
        it('query should get status 200 with array and two items', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: query})
                .end((err, res) => {
                    const tickets = res.body.data.tickets;

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('tickets');
                    tickets.should.be.a('array');
                    tickets.should.have.lengthOf(2);
                    tickets[1].trainnumber.should.equal('67890');
                    done();
                });
        });

        // Test update ticket with stub answer from jwt.verify
        it('update should succeed since logged in', (done) => {
            const mutation = `mutation {
                updateTicket (
                  _id: "${ticketId}",
                  code: "ANAnew101"
                  ){
                    _id
                    code
                }
            }`;

            // Stub the jwt.verify function to always return a successful verification
            const jwtStub = sinon.stub(jwt, 'verify').callsFake(() => {
                return {
                    email: "mockedEmail@example.com"
                };
            });

            chai.request(httpServer)
                .post('/graphql')
                .set('x-access-token', 'onlyneededtomakeauthModelusejwtverify')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    const ticket = res.body.data.updateTicket;

                    res.should.have.status(200);
                    ticket.should.be.a('object');
                    ticket.should.have.property('_id');
                    ticket.code.should.equal('ANAnew101');

                    jwtStub.restore();
                    done();
                });
        });

        // Test update ticket with stub answer from jwt.verify
        it('delete should succeed since logged in', (done) => {
            const mutation = `mutation {
                deleteTicket (
                  _id: "${ticketId}",
                  ){
                    _id
                }
            }`;

            // Stub the jwt.verify function to always return a successful verification
            const jwtStub = sinon.stub(jwt, 'verify').callsFake(() => {
                return {
                    email: "mockedEmail@example.com"
                };
            });

            chai.request(httpServer)
                .post('/graphql')
                .set('x-access-token', 'onlyneededtomakeauthModelusejwtverify')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    const ticket = res.body.data.deleteTicket;

                    res.should.have.status(200);
                    ticket.should.be.a('object');
                    ticket.should.have.property('_id');

                    jwtStub.restore();
                });

            ticketsModel.getTickets()
                .then((res) => {
                    res.should.be.a('array');
                    res.should.have.lengthOf(1);
                })

            done();
        });
    });

    describe('query for codes', () => {
        it('should get status 200 with an array in data', (done) => {
            const query = `{
                codes {
                    Code
                    Level1Description
                    Level2Description
                    Level3Description
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query})
                .end((err, res) => {
                    const codes = res.body.data.codes;
                    const firstElement = codes[0];

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('codes');
                    codes.should.be.a('array');
                    codes.length.should.be.above(0);
                    firstElement.should.have.property("Code");
                    firstElement.should.have.property("Level3Description");
                    done();
                });
        });
    });

    describe('query for delayed trains', () => {
        it('should get status 200 with an array in data', (done) => {
            const query = `{
                delayed {
                    LocationSignature
                    OperationalTrainNumber
                    FromLocation {
                        LocationName
                    }
                    ToLocation {
                        LocationName
                    }
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query})
                .end((err, res) => {
                    const delayed = res.body.data.delayed;

                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('delayed');
                    delayed.should.be.a('array');

                    // If statement because there can be no delayed trains
                    if (delayed.length > 0) {
                        const firstElement = delayed[0];

                        firstElement.should.have.property("OperationalTrainNumber");
                        firstElement.should.have.property("LocationSignature");
                    }

                    // Loop is to find a delayed train with a FromLocation (not all have them)
                    for (const train of delayed) {
                        if (train.FromLocation) {
                            train.FromLocation.should.be.a('array');
                            train.FromLocation[0].should.have.property('LocationName');
                        }
                    }

                    done();
                });
        });
    });

    // Create a new user
    describe('creating a new user', () => {
        const mutation = `mutation {
            createUser(
                email: "routeTest@graph.ql"
                password: "hejpASo1234"
            ) {
                message
            }
        }`;

        // Creating a user
        it('should return a successfully message', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    res.body.data.createUser.message.should.include('successfully');
                    done();
                });
        });

        // Trying creating user with with already exisiting email
        it('should return error since user already exists', (done) => {
            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include('User already exists');
                    done();
                });
        });

        // Trying creating user with without password
        it('should return error since missing password', (done) => {
            const mutation = `mutation {
                createUser(
                    email: "routeTest@graph.ql"
                    password: ""
                ) {
                    message
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include('Missing email or password.');
                    done();
                });
        });

        // Trying creating user with without email
        it('should return error since missing email', (done) => {
            const mutation = `mutation {
                createUser(
                    email: ""
                    password: "tEsTpAssWooord"
                ) {
                    message
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include('Missing email or password.');
                    done();
                });
        });
    });

    // Create a new user
    describe('logging in as a user', () => {
        const email = "routeLogin@test.ql";
        const password = "PossWordali2";

        // First create the user to use for test
        it('should return a successfully message', (done) => {
            const mutation = `mutation {
                createUser(
                    email: "${email}"
                    password: "${password}"
                ) {
                    message
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    res.body.data.createUser.message.should.include('successfully');
                    done();
                });
        });

        // Try logging in in the wrong way
        it('should return an missing password error', (done) => {
            const mutation = `mutation {
                authUser(
                    email: "${email}"
                    password: ""
                ) {
                    message
                    jwt
                    user {
                        email
                    }
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include('Missing email or password.');
                    done();
                });
        });

        // Try logging in in the wrong way
        it('should return an wrong password error', (done) => {
            const mutation = `mutation {
                authUser(
                    email: "${email}"
                    password: "wrongpassword"
                ) {
                    message
                    jwt
                    user {
                        email
                    }
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include('Wrong password.');
                    done();
                });
        });


        // Try logging in in the wrong way
        it('should return an user dosen\'t exist error', (done) => {
            const mutation = `mutation {
                authUser(
                    email: "non@existing.com"
                    password: "wrongpassword"
                ) {
                    message
                    jwt
                    user {
                        email
                    }
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('errors');
                    res.body.errors[0].message.should.include(
                        'User with e-mail non@existing.com dosen\'t exist.'
                    );
                    done();
                });
        });

        // Try logging in in the wrong way
        it('should succeed and returning a jwt with userpayload', (done) => {
            const mutation = `mutation {
                authUser(
                    email: "${email}"
                    password: "${password}"
                ) {
                    message
                    jwt
                    user {
                        email
                    }
                }
            }`;

            chai.request(httpServer)
                .post('/graphql')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({query: mutation})
                .end((err, res) => {
                    const userPayload = res.body.data.authUser;
                    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

                    res.should.have.status(200);
                    userPayload.jwt.should.match(jwtRegex);
                    userPayload.user.email.should.equal(email);
                    done();
                });
        });
    });
});
