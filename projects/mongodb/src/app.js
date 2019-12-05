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
      getAuthor(_id: ID!): Author
      getAuthors: [Author!]
      getPosts: [Post!]
      getPost(_id: ID!): Post
    }

    type Mutation{
      addAuthor(name: String!, age: Int!):Author!
      addPost(title: String!, body: String!, author: ID!):Post!

      removeAuthor(_id: ID!): Author
      removePost(_id: ID!): Post

      updateAuthor(_id: ID!, name: String, age: Int):Author
      updatePost(_id: ID!, title: String, body: String, author: ID):Post
    }

    type Author{
      _id: ID!
      name: String!
      age: Int!
      posts: [Post!]
    }

    type Post{
      _id: ID!
      author: Author!
      title: String!
      body: String!
    }
    `;

  const resolvers = {
    Author:{
      posts: async (parent, args, ctx, info) => {
        const ids = parent.posts;
        const db = ctx.db;
        const collection = db.collection("posts");

        const query = {_id : {$in: ids}};
        return collection.find(query).toArray();
      }
    },

    Query: {
      getAuthor: async (parent, args, ctx, info) => {
        const { _id } = args;
        // _id = args._id;
        const { db } = ctx;
        const collection = db.collection("authors");
        const result = await collection.findOne({ _id: ObjectID(_id) });
        if(result) return result;
        throw new Error("Author not found");
      },

      getAuthors: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("blog");
        const collection = db.collection("authors");
        return collection.find().toArray();
      },

      

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
    runGraphQLServer({ client, db: client.db("blog") });
  } catch (e) {
    client.close();
  }
};

await runApp();
console.log("Hola");
