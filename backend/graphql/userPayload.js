import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

// Payload for the user. If data is needed for a user it can be sent in the payload
const PayloadType = new GraphQLObjectType({
    name: 'Payload',
    description: 'This represents the payload',
    fields: () => ({
        email: { type: GraphQLNonNull(GraphQLString)}
    })
});

const UserPayloadType = new GraphQLObjectType({
    name: 'Userpayload',
    description: 'This represents the object returned for a user logging in',
    fields: () => ({
        user: { type: PayloadType },
        message: { type: GraphQLNonNull(GraphQLString)}, // Used to message front-end
        jwt: { type: GraphQLNonNull(GraphQLString)} // Used to message front-end
    })
});

export default UserPayloadType;
