import { GraphQLObjectType, GraphQLList } from 'graphql';

import TicketType from "./ticket.js";
import CodeType from "./code.js";
import DelayedType from "./delayed.js";
import TrainType from "./trains.js";
import ticketsModel from '../models/tickets.js';
import codeModel from '../models/codes.js';
import delayedModel from '../models/delayed.js';
import trainsModel from '../models/trains.js';

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        tickets: {
            type: GraphQLList(TicketType),
            description: 'A list of tickets',
            resolve: async function() {
                return await ticketsModel.getTickets();
            }
        },
        codes: {
            type: GraphQLList(CodeType),
            description: 'A list of codes',
            resolve: async function() {
                return await codeModel.getCodes();
            }
        },
        delayed: {
            type: GraphQLList(DelayedType),
            description: 'A list of delayed trains',
            resolve: async function() {
                return await delayedModel.getDelayedTrains();
            }
        },
        trains: {
            type: GraphQLList(TrainType),
            description: 'A list of trains with positions',
            resolve: async function() {
                const result = await trainsModel.getTrains();

                return result.TrainPosition;
            }
        },
    })
});

export default RootQueryType;
