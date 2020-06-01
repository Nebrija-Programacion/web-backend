import "babel-polyfill";
import { ApolloServer } from "apollo-server";
import connectToDb from "./db";
import Query from "./resolvers/Query";
import typeDefs from "./schema";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const usr = process.env.MONGO_DB_USERNAME;
const pwd = process.env.MONGO_DB_PASSWORD;
const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function (context) {
  const resolvers = {
    Query,
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  const options = {
    port: 4000,
  };

  server
    .listen(options)
    .then(({ url }) => {
      console.log(`Server started, listening on ${url} for incoming requests.`);
    })
    .catch((e) => {
      console.info(e);
      server.close();
    });
};

const runApp = async function () {
  const { client, db } = await connectToDb(usr, pwd, url, dbName);
  console.info("Connected to Mongo DB");
  try {
    runGraphQLServer({ client, db });
  } catch (e) {
    console.log(e);
    client.close();
  }
};

runApp();
