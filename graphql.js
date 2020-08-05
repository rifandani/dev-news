const { GraphQLServer, PubSub } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const path = require('path');
// const pathComp = require('express-static');
// files
// const { typeDefs } = require('./utils/typeDefs');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

// const app = express();
// subscription => create permanent websocket conn to server
const pubsub = new PubSub();
// prisma client
const prisma = new PrismaClient();

// actual implementation of the GraphQL schema
// 1. parent/root = result of the previous call
// 2. args = input argument ketika request mutation
// 3. context = An object that gets passed through the resolver chain that each resolver can write to and read from
// 4. info = An AST representation of the query or mutation
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

// tells the server what API operations are accepted and how they should be resolved
const server = new GraphQLServer({
  // typeDefs,
  typeDefs: './schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub,
    };
  },
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder == pathComp(__dirname + "/client/build")
  server.express.use(express.static('client/build'));

  server.express.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// start server
server.start(
  {
    cors: {
      origin: true,
      credentials: true,
    },
    port: process.env.PORT || 4000,
    // endpoint: '/graphql'
  },
  ({ port }) => console.log(`Server is running on port ${port}`),
);
