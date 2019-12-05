import {GraphQLServer} from 'graphql-yoga'
import {MongoClient, ObjectID} from 'mongodb';
import * as uuid from 'uuid';
import 'babel-polyfill';



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


const startGraphql  = (client) => {
    const typeDefs = `

    type Query {
        ok: String!
        getBills(author: ID!, token: String!): [Bill!]
        getBill(bill: ID!, token: String, author: ID!): Bill!
    }

    type Mutation {
        signup(name: String!, pwd: String!, email: String!): Author!
        login(name: String!, pwd:String!):Author!
        logout(name: String!, token: String!): Author!
        addBill(author: ID!, token:String!, amount:Int!):Bill!
        removeBill(author: ID!, token:String!, bill:ID!):Bill!
        removeUser(author: ID!, token:String!): Author!
    }

    type Author {
        name: String!
        _id: ID!
        pwd: String!
        email: String!
        bills: [Bill!]   
        token: String
    }

    type Bill{
        amount: Int!
        _id: ID!
        author: Author!
        date: String!
    }
    `;

    const resolvers = {
        Bill: {
            author: (parent, args, ctx, info) => {
                const {client} = ctx;
                const {author} = parent;
                
                const db = client.db("blog");
                const usersCollection = db.collection("users");
                const authorFound = usersCollection.findOne({_id:author});
                if(!authorFound){
                    throw new Error("Unexpected error");
                }

                return authorFound;
            }
        },

        Query: {
            ok: (parent, args, ctx, info) => {
                return "ok";
            },
        },

        Mutation: {
            addBill: async (parent, args, ctx, info) => {
                const {client} = ctx;
                const {author, token, amount} = args;
                
                const db = client.db("blog");
                const usersCollection = db.collection("users");
                const billsCollection = db.collection("bills");

                const logged = await usersCollection.findOne({_id:author,token});
                if(!logged) throw new Error("Unauthorized");

                const date = new Date().getDate();

                const inserted =  await billsCollection.insertOne(
                    {
                        amount,
                        date,
                        author: ObjectID(author)
                    }
                );

                return inserted.ops[0];
                
            },

            logout: async (parent, args, ctx, info) => {
                const {client} = ctx;
                const {name, token} = args;
                
                const db = client.db("blog");
                const usersCollection = db.collection("users");

                const result = await usersCollection.findOneAndUpdate(
                    {name, token},
                    {$set: {token: undefined}},
                    {returnOriginal:false}
                );

                if(!result.value){
                    throw new Error("Invalid user name or user not logged")
                }

                return result.value;
        
            },

            login: async (parent, args, ctx, info) => {
                const {client} = ctx;
                const {name, pwd} = args;
                
                const db = client.db("blog");
                const usersCollection = db.collection("users");
                const token = uuid.v4();

                const updated = await usersCollection.findOneAndUpdate(
                    {name, pwd},
                    {$set: {token}},
                    {returnOriginal: false} 
                );

                if(!updated.value){
                    throw new Error("User unknown or incorrect pwd");
                }

                setTimeout( () => {
                    usersCollection.updateOne({name}, {$set: {token:undefined}});
                }, 3000000)

                return updated.value;
            },

            signup: async (parent, args, ctx, info) => {
                const {client} = ctx;
                const {name, pwd, email} = args;
                
                const db = client.db("blog");
                const usersCollection = db.collection("users");

                const found = await usersCollection.findOne(
                    {
                        $or: [
                            {name},
                            {email}
                        ]
                    });
                if(found){
                    throw new Error("Name or mail is taken");
                }

                console.log("estoy aquí");

                const user = await usersCollection.insertOne({name, email, pwd, token:""});
                return user.ops[0];
                
            }
        }
    }

    const context = {client};
    const server = new GraphQLServer({typeDefs, resolvers, context});
    server.start(() => console.log("Server listening my friend"));
}


const runApp = async() =>{
    const usr = "avalero";
    const pwd = "123456abc";
    const url = "cluster0-e8ug9.mongodb.net/test?retryWrites=true&w=majority";
    try{
        const client = await connectToDb(usr, pwd, url);
        startGraphql(client);
    }catch(e){
        client.close();
        console.log(e);
    }
}

runApp();