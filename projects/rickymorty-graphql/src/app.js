import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga';

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

/**
 * Main App
 * @param data all rickyandmorty database
 */
const runServer = (data, typeDefs, resolvers) => {
  data.forEach(element => {
    console.log(`${element.id}: ${element.name}`);
  });

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
  });

  server.start(() => {
    console.log('The server is up!');
  });
};

const main = data => {
  // Type definions (schema)
  const typeDefs = `
    type Query {
      hello: String!
    }
  `;

  // Resolvers
  const resolvers = {
    Query: {
      hello() {
        return 'Hello world!';
      },
    },
  };
  return runServer(data, typeDefs, resolvers);
};

// main program
fetchData(main, url);
