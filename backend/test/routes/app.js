/**
 * Test the route
 */


import { describe, it } from 'mocha';
import { expect } from 'chai';
import fetch from 'node-fetch';
// import httpServer from '../../app.js';

describe('Express API Tests', () => {
  let expressServer;

//   before(async () => {
//     expressServer = await httpServer.listen(1337); // Set the desired port
//   });

  after(async () => {
    expressServer && (await expressServer.close());
  });

  describe('GET /', () => {
    it('should return a welcome message', async () => {
      const response = await fetch('https://jsramverk-backend-deploy-glpa22.azurewebsites.net');
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
      expect(responseBody).to.deep.equal({ data: 'This is the API for the course jsramverk, by students glpa22 and haco22' });
    });
  });

  describe('GET /delayed', () => {
    it('should return delayed train information', async () => {
      const response = await fetch('https://jsramverk-backend-deploy-glpa22.azurewebsites.net/delayed');
      const responseBody = await response.json();

      expect(response.status).to.equal(200);
    });
  });
});
