import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./gql/schema.ts";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
