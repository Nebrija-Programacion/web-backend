import { serve } from "std/http/server.ts";
import { MongoClient, ObjectId } from 'npm:mongodb@5'

// connect to mongo
const url = 'mongodb://mongo:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'Agenda';

// Use connect method to connect to the server
await client.connect();
console.log('Connected successfully to Mongo server');
const db = client.db(dbName);
const UsersCollection = db.collections("Users");

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  switch (req.method) {
    case "GET": {
      switch (url.pathname) {
        case "/contacts": {
          const contacts = await UsersCollection.find().toArray();
          return new Response(JSON.stringify({ contacts }), {
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
        default:
          return new Response("Invalid route", { status: 404 });
      }
    }
    case "DELETE": {
      switch (url.pathname) {
        case "/deleteContact": {
          if (req.body) {
            const body = await req.body({ type: "json" }).value;
            console.log("Body:", body);
            const id = body.id
            try {
              await UsersCollection.deleteOne({ _id: new ObjectId(id) });
              return new Response("OK", { status: 200 });
            } catch (e) {
              return new Response(e, { status: 500 });
            }
          } else {
            return new Response("Invalid data", { status: 403 });
          }
        }
        default:
          return new Response("Invalid route", { status: 404 });
      }
    }

    case "POST": {
      switch (url.pathname) {
        case "/addContact": {
        }
        default:
          return new Response("Invalid route", { status: 404 });
      }
    }
    default:
      return new Response("Invalid method", { status: 405 });
  }
}




// serve on port 8080
console.log("Ready to accept connections on port 8080");
serve(handler, { port: 8080 });