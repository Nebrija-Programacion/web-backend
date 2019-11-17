import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";

import "babel-polyfill";

const usr = "avalero";
const pwd = "123456abc";
const url = "cluster0-e8ug9.mongodb.net/test?retryWrites=true&w=majority";

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

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  const typeDefs = `
    type Query{
      getAuthor(id: ID!): Author
      getAuthors: [Author]!
    }

    type Mutation{
      addAuthor(name: String!, age: Int!):Author!
    }

    type Author{
      id: ID!
      name: String!
      age: Int!
    }
    `;

  const resolvers = {
    Query: {
      getAuthor: async (parent, args, ctx, info) => {
        const { id } = args;
        const { client } = ctx;
        const db = client.db("blog");
        const collection = db.collection("authors");
        const result = await collection.findOne({ _id: ObjectID(id) });
        return result;
      },
      getAuthors: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("blog");
        const collection = db.collection("authors");
        const result = await collection.find({}).toArray();
        return result;
      }
    },
    Mutation: {
      addAuthor: async (parent, args, ctx, info) => {
        const { name, age } = args;
        const { client } = ctx;

        const db = client.db("blog");
        const collection = db.collection("authors");
        const result = await collection.insertOne({ name, age });

        return {
          name,
          age,
          id: result.ops[0]._id
        };
      }
    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers, context });
  const options = {
    port: 8000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client });
  } catch (e) {
    client.close();
  }
};

runApp();
