/**
 * Indexfile for graphQL, defining schema and such
 */
// GraphQL imports & setup
import { GraphQLSchema } from "graphql";

import RootQueryType from "./root.js";
import RootMutationType  from "./mutation.js";
// import { Schema } from "mongoose";

// GraphQL route
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

export default schema;
