import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Contact } from "./resolvers/contact.ts";
import { typeDefs } from "./gql/schema.ts";
import montoose from "mongoose";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  throw new Error("Please provide a MongoDB connection string");
}

// Connect to MongoDB
await montoose.connect(MONGO_URL);

console.info("🚀 Connected to MongoDB");

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Contact,
  },
});

const { url } = await startStandaloneServer(server, { listen: 8000 });
console.info(`🚀 Server ready at ${url}`);
