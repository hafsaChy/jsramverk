import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const UserRegType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents the response when a user registers',
    fields: () => ({
        email: { type: GraphQLNonNull(GraphQLString) },
        message: { type: GraphQLNonNull(GraphQLString)} // Used to message front-end
    })
});

export default UserRegType;
