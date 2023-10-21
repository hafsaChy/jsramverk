/**
 * Test for model auth
 */

/*global it describe before */

process.env.NODE_ENV = 'test';

import { should } from 'chai';
import { openDb } from '../../db/database';
import { getUsers, register, login } from '../../models/auth';

should();

describe('Test model', () => {
    const colName = 'users';
    /**
     * Before test, reset the user database
     */

    before(async () => {
        const db = await openDb();

        try {
            const col = await db.collection(colName);

            await col.deleteMany(); // This deletes the data in the collection
        } catch (err) {
            console.log("During setup following error occured:", err);
        } finally {
            await db.client.close();
        }
    });

    /**
     * Test to register a user
     */
    describe('auth register', () => {
        it('should return empty array', async () => {
            const res = await getUsers();

            res.should.be.a('array');
            res.should.have.lengthOf(0);
        });

        it('should return object with successfull message for new user', async () => {
            const res = await register({
                email: "test@user.login",
                password: "pAs$w0rD12345"
            });

            res.should.be.a('object');
            res.should.have.property('message');
            res.message.should.include('successfully');
        });

        it('should return error message when missing field password', async () => {
            let error;

            try {
                await register({
                    email: "test@user.login",
                });
            } catch (e) {
                error = e;
            }

            error.should.be.an('error');
            error.message.should.include('Missing email or password.');
        });


        it('should return error message when user exists', async () => {
            let error;

            try {
                await register({
                    email: "test@user.login",
                    password: "pAs$w0rD12345"
                });
            } catch (e) {
                error = e;
            }

            error.should.be.an('error');
            error.message.should.include('User already exists');
        });
    });

    /**
     * Test to see there are no users in collection
     */
    describe('auth login', () => {
        const credentials = {
            email: "secondTest@user.login",
            password: "pAs$w0rD12345"
        };

        // First create a user so this part of test not is depending on other description
        it('should return object with successfull message for new user', async () => {
            const res = await register(credentials);

            res.should.be.a('object');
            res.should.have.property('message');
            res.message.should.include('successfully');
        });

        it('should return object with error wrong password', async () => {
            let error;

            try {
                await login({
                    email: "secondTest@user.login",
                    password: "thisiswrong"
                });
            } catch (e) {
                error = e;
            }

            error.should.be.an('error');
            error.message.should.include('Wrong password');
        });

        it('should return object when trying to log in with jwt', async () => {
            const res = await login(credentials);
            const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

            res.should.be.a('object');
            res.should.have.property('jwt');
            res.jwt.should.match(jwtRegex);
        });

        it('should return object with error missing email', async () => {
            let error;

            try {
                await login({password: "email missing"});
            } catch (e) {
                error = e;
            }

            error.should.be.an('error');
            error.message.should.include('Missing email');
        });

        it('should return object with error non existing email', async () => {
            let error;

            try {
                await login({
                    email: "doesnotexist@no.where",
                    password: "willnotwork"
                });
            } catch (e) {
                error = e;
            }

            error.should.be.an('error');
            error.message.should.include('e-mail doesnotexist@no.where dosen\'t exist');
        });
    });
});
