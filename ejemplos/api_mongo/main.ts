import { MongoClient } from "mongodb";
import type { BookModel, UserModel } from "./types.ts";
import { fromModelToUser } from "./utils.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  console.error("MONGO_URL is not set");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected to MongoDB");

const db = client.db("agenda");

const usersCollection = db.collection<UserModel>("users");
const booksCollection = db.collection<BookModel>("books");

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if (method === "GET") {
    if (path === "/users") {
      const name = url.searchParams.get("name");
      if (name) {
        const usersDB = await usersCollection.find({ name }).toArray();
        const users = await Promise.all(
          usersDB.map((u) => fromModelToUser(u, booksCollection))
        );
        return new Response(JSON.stringify(users));
      }

      const usersDB = await usersCollection.find().toArray();
      const users = await Promise.all(
        usersDB.map((u) => fromModelToUser(u, booksCollection))
      );
      return new Response(JSON.stringify(users));
    } else if (path === "/user") {
      const email = url.searchParams.get("email");
      if (!email) return new Response("Bad request", { status: 400 });
      const userDB = await usersCollection.findOne({
        email,
      });
      if (!userDB) return new Response("User not found", { status: 404 });
      const user = await fromModelToUser(userDB, booksCollection);
      return new Response(JSON.stringify(user));
    }
  } else if (method === "POST") {
    if (path === "/user") {
      const user = await req.json();
      if (!user.name || !user.email || !user.age) {
        return new Response("Bad request", { status: 400 });
      }
      // check if mail already exists
      const userDB = await usersCollection.findOne({
        email: user.email,
      });
      if (userDB) return new Response("User already exists", { status: 409 });

      const { insertedId } = await usersCollection.insertOne({
        name: user.name,
        email: user.email,
        age: user.age,
        books: [],
      });
      return new Response(
        JSON.stringify({
          name: user.name,
          email: user.email,
          age: user.age,
          id: insertedId,
        }),
        { status: 201 }
      );
    }
  } else if (method === "PUT") {
    const user = await req.json();
    if (!user.name || !user.email || !user.age) {
      return new Response("Bad request", { status: 400 });
    }
    // find by email and update
    const { modifiedCount } = await usersCollection.updateOne(
      { email: user.email },
      { $set: { name: user.name, age: user.age } }
    );

    if (modifiedCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("OK", { status: 200 });
  } else if (method === "DELETE") {
    const user = await req.json();
    if (!user.email) {
      return new Response("Bad request", { status: 400 });
    }

    const { deletedCount } = await usersCollection.deleteOne({
      email: user.email,
    });

    if (deletedCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("OK", { status: 200 });
  }

  return new Response("endpoint not found", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
