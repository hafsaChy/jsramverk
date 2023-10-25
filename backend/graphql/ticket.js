import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';

const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    description: 'This represents a ticket',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLID) },
        code: { type: GraphQLNonNull(GraphQLString) },
        trainnumber: { type: GraphQLNonNull(GraphQLString) },
        traindate: { type: GraphQLNonNull(GraphQLString)},
    })
});

export default TicketType;
