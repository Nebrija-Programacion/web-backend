import { GraphQLServer, PubSub } from "graphql-yoga";
import { MongoClient } from "mongodb";
import "babel-polyfill";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Bill from "./resolvers/Bill";
import Subscription from "./resolvers/Subscription";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

const startGraphql = client => {
  const resolvers = {
    Bill,
    Query,
    Mutation,
    Subscription
  };

  const pubsub = new PubSub();

  const context = { client, pubsub };
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context
  });
  server.start(() => console.log("Server listening my friend"));
};

const runApp = async () => {
  const usr = "avalero";
  const pwd = "123456abc";
  const url = "cluster0-e8ug9.mongodb.net/test?retryWrites=true&w=majority";

  try {
    const client = await connectToDb(usr, pwd, url);
    startGraphql(client);
  } catch (e) {
    //client.close();
    console.log(e);
  }
};

runApp();
