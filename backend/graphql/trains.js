import { GraphQLObjectType, GraphQLString } from 'graphql';

const TrainData = new GraphQLObjectType({
    name: 'TrainData',
    description: 'This represents a train location',
    fields: () => ({
        OperationalTrainNumber: { type: GraphQLString },
        AdvertisedTrainNumber: { type: GraphQLString }
    })
});

const PositionData = new GraphQLObjectType({
    name: 'PositionData',
    description: 'This represents a the gps data for a train',
    fields: () => ({
        SWEREF99TM: { type: GraphQLString },
        WGS84: { type: GraphQLString }
    })
});

const TrainType = new GraphQLObjectType({
    name: 'Train',
    description: 'This represents a train with positions',
    fields: () => ({
        Train: { type: TrainData },
        Position: { type: PositionData }
    })
});

export default TrainType;
