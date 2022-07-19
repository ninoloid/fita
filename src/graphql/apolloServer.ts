import { ApolloServer, IResolvers } from 'apollo-server-lambda';
import * as queries from './resolvers/queries';
import * as mutations from './resolvers/mutations';
import typeDefs from './type-defs';

const NODE_ENV = process.env.NODE_ENV;

const IS_DEV = !NODE_ENV || !['production'].includes(NODE_ENV);

const resolvers = {
  Mutation: mutations,
  Query: queries,
} as IResolvers;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // subscriptions: {},
  introspection: IS_DEV,
  playground: {
    endpoint: '/dev/graphql'
  }
  // context: {},
});

export default apolloServer.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
