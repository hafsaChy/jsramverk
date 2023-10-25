import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLList } from 'graphql';

const LocationType = new GraphQLObjectType({
    name: 'Location',
    description: 'This represents a train location',
    fields: () => ({
        LocationName: { type: GraphQLString },
        Priority: { type: GraphQLInt },
        Order: { type: GraphQLInt },
    })
});

const DelayedType = new GraphQLObjectType({
    name: 'Delayed',
    description: 'This represents a delayed train',
    fields: () => ({
        ActivityId: { type: GraphQLString },
        ActivityType: { type: GraphQLString },
        AdvertisedTimeAtLocation: { type: GraphQLString },
        EstimatedTimeAtLocation: {type: GraphQLString},
        AdvertisedTrainIdent: { type: GraphQLString},
        OperationalTrainNumber: { type: GraphQLString},
        Canceled: { type: GraphQLBoolean},
        FromLocation: { type: GraphQLList(LocationType)},
        ToLocation: { type: GraphQLList(LocationType)},
        LocationSignature: { type: GraphQLString},
        TimeAtLocation: { type: GraphQLString},
        TrainOwner: { type: GraphQLString},
    })
});

export default DelayedType;
