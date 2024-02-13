// import { describe, it, beforeEach, afterEach } from 'mocha';
// import { expect } from 'chai';
// import sinon from 'sinon';
// import fetch from 'node-fetch';
// import nock from 'nock';
// import delayed from '../../models/delayed.js';
// import Chance from 'chance';

// describe('Delayed Trains API', () => {
//     describe('getDelayedTrains', () => {
//         let chance;
//         let mockResponse;

//         beforeEach(() => {
//             chance = new Chance();
//             mockResponse = generateMockResponse(chance, 3);
//         });

//         afterEach(() => {
//             nock.cleanAll();
//         });

//         it('should get delayed trains', async () => {
//             const req = {};
//             const res = {
//                 json: sinon.stub(),
//             };

//             const query = '<REQUEST>...</REQUEST>';

//             nock('https://api.trafikinfo.trafikverket.se')
//                 .post('/v2/data.json', query)
//                 .reply(200, mockResponse);

//             process.env.TRAFIKVERKET_API_KEY = 'b6dc46030edb46bf97106dba290284f5';

//             console.log('Before calling getDelayedTrains');
//             await delayed.getDelayedTrains(req, res);
//             console.log('After calling getDelayedTrains');

//             // Check if the json method was called
//             console.log('res.json.calledOnce:', res.json.calledOnce);

//             console.log('res.json.calls:', res.json.calls);
//             expect(res.json.calledOnce).to.be.true;

//             // Use deep.equal to compare the objects
//             console.log('res.json.firstCall.args[0]:', res.json.firstCall.args[0]);
//             expect(res.json.firstCall.args[0]).to.deep.equal({ data: mockResponse.RESPONSE.RESULT[0].TrainAnnouncement });
//         });
//     });
// });

// const generateMockTrainAnnouncement = (chance) => ({
//     ActivityId: chance.guid(),
//     ActivityType: 'Avgang',
//     AdvertisedTimeAtLocation: chance.date({ string: true }),
//     AdvertisedTrainIdent: chance.integer({ min: 1000, max: 9999 }).toString(),
//     Canceled: chance.bool(),
//     EstimatedTimeAtLocation: chance.date({ string: true }),
//     FromLocation: [
//         {
//             LocationName: chance.city(),
//             Priority: chance.integer({ min: 1, max: 5 }),
//             Order: chance.integer({ min: 0, max: 2 }),
//             LocationSignature: chance.word(),
//             OperationalTrainNumber: chance.integer({ min: 10000, max: 99999 }).toString(),
//         }
//         // Add more locations if needed
//     ],
//     ToLocation: [
//         {
//             LocationName: chance.city(),
//             Priority: chance.integer({ min: 1, max: 5 }),
//             Order: chance.integer({ min: 0, max: 2 }),
//             LocationSignature: chance.word(),
//             OperationalTrainNumber: chance.integer({ min: 10000, max: 99999 }).toString(),
//         }
//         // Add more locations if needed
//     ],
//     // Add more fields if needed
// });

// const generateMockResponse = (chance, numTrainAnnouncements = 1) => ({
//     RESPONSE: {
//         RESULT: Array.from({ length: numTrainAnnouncements }, () => ({
//             TrainAnnouncement: Array.from({ length: numTrainAnnouncements }, () => generateMockTrainAnnouncement(chance)),
//         })),
//     },
// });
