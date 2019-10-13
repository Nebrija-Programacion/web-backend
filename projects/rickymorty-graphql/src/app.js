import { fetchData } from './fetchdata';
import { getCharacter, getByStatus, getByPage } from './utils';
import { GraphQLServer } from 'graphql-yoga';

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

/**
 * Main App
 * @param data all rickyandmorty database
 */
const runServer = (data, typeDefs, resolvers) => {
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
      info: Info!
      character(id:ID!): Character
      characters(status:String, name: String, page:Int, pageSize: Int): [Character]!
    }

    type Info {
      total: Int!
      pages: Int!
    }

    type Character {
      id: ID!
      name: String!
      status: String!
      planet: String!
    }
  `;

  // Resolvers
  const resolvers = {
    Query: {
      info() {
        return {
          total: data.length,
          pages: Math.ceil(data.length / 20),
        };
      },

      character(parent, args, ctx, info) {
        return getCharacter(args.id, data);
      },

      characters(parent, args, ctx, info) {
        const page = args.page || 1;
        console.log(args.pageSize);
        const pageSize = args.pageSize || 20;
        console.log(pageSize);
        let filteredData = data;

        if (args.status) {
          filteredData = getByStatus(args.status, data);
        }

        return getByPage(filteredData, pageSize, page);
      },
    },
  };

  return runServer(data, typeDefs, resolvers);
};

// main program
fetchData(main, url);
