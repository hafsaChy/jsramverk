import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';

import UserRegType from './userReg.js';
import TicketType from'./ticket.js';
import UserPayloadType from './userPayload.js';
import ticketsModel from '../models/tickets.js';
import authModel from '../models/auth.js';

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createTicket: {
            type: TicketType,
            description: 'Create a new ticket',
            args: {
                code: { type: GraphQLNonNull(GraphQLString) },
                trainnumber: { type: GraphQLNonNull(GraphQLString) },
                traindate: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async function(_, args, context) {
                if (!context.req.isAuth) {
                    // IF not authenticated this error-text will show in graphql-response
                    throw new Error("Not authenticated.");
                }

                try {
                    const newTicket = await ticketsModel.createTicket(args);

                    return newTicket;
                } catch (error) {
                    throw new Error('Error creating a ticket: ' + error.message);
                }
            }
        },
        updateTicket: {
            type: TicketType,
            description: 'Update a given ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                code: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async function(_, args, context) {
                if (!context.req.isAuth) {
                    // IF not authenticated this error-text will show in graphql-response
                    throw new Error("Not authenticated.");
                }
                try {
                    const updatedTicket = await ticketsModel.updateTicket(args);

                    return updatedTicket;
                } catch (error) {
                    throw new Error('Error creating a ticket: ' + error.message);
                }
            },
        },
        deleteTicket: {
            type: TicketType,
            description: 'Delete a given ticket',
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: async function(_, args, context) {
                if (!context.req.isAuth) {
                    // IF not authenticated this error-text will show in graphql-response
                    throw new Error("Not authenticated.");
                }

                try {
                    const deleteTicket = await ticketsModel.deleteTicket(args);

                    return deleteTicket;
                } catch (error) {
                    throw new Error('Error creating a ticket: ' + error.message);
                }
            },
        },
        createUser: {
            type: UserRegType,
            description: 'Create a new user',
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async function(_, args) {
                try {
                    const user = await authModel.register(args);

                    return user;
                } catch (error) {
                    throw new Error('Error creating a user: ' + error.message);
                }
            }
        },
        authUser: {
            type: UserPayloadType,
            description: 'Login with user credentials',
            args: {
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async function(_, args) {
                try {
                    const userPayload = await authModel.login(args);

                    return userPayload;
                } catch (error) {
                    throw new Error('Error logging in: ' + error.message);
                }
            }
        }
    })
});

export default RootMutationType;
