import { MongoClient, ObjectId } from "mongodb";
import type { BookModel, UserModel } from "./types.ts";
import { fromModelToBook, fromModelToUser } from "./utils.ts";

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
      } else {
        const usersDB = await usersCollection.find().toArray();
        const users = await Promise.all(
          usersDB.map((u) => fromModelToUser(u, booksCollection))
        );
        return new Response(JSON.stringify(users));
      }
    } else if (path === "/user") {
      const email = url.searchParams.get("email");
      if (!email) return new Response("Bad request", { status: 400 });
      const userDB = await usersCollection.findOne({
        email,
      });
      if (!userDB) return new Response("User not found", { status: 404 });
      const user = await fromModelToUser(userDB, booksCollection);
      return new Response(JSON.stringify(user));
    } else if (path === "/books") {
      const booksDB = await booksCollection.find().toArray();
      const books = booksDB.map((b) => fromModelToBook(b));
      return new Response(JSON.stringify(books));
    } else if (path === "/book") {
      // /book?id=1232312131233223232
      const id = url.searchParams.get("id");
      if (!id) return new Response("Bad request", { status: 400 });
      const bookDB = await booksCollection.findOne({ _id: new ObjectId(id) });
      if (!bookDB) return new Response("Book not found", { status: 404 });
      const book = fromModelToBook(bookDB);
      return new Response(JSON.stringify(book));
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
          books: [],
          id: insertedId,
        }),
        { status: 201 }
      );
    } else if (path === "/book") {
      const book = await req.json();
      if (!book.title || !book.pages) {
        return new Response("Bad request", { status: 400 });
      }
      const { insertedId } = await booksCollection.insertOne({
        title: book.title,
        pages: book.pages,
      });
      return new Response(
        JSON.stringify({
          title: book.title,
          pages: book.pages,
          id: insertedId,
        }),
        { status: 201 }
      );
    }
  } else if (method === "PUT") {
    if (path === "/user") {
      const user = await req.json();
      if (!user.name || !user.email || !user.age || !user.books) {
        return new Response("Bad request", { status: 400 });
      }

      if (user.books) {
        const books = await booksCollection
          .find({
            _id: { $in: user.books.map((id: string) => new ObjectId(id)) },
          })
          .toArray();
        if (books.length !== user.books.length) {
          return new Response("Book not found", { status: 404 });
        }
      }

      // find by email and update
      const { modifiedCount } = await usersCollection.updateOne(
        { email: user.email },
        { $set: { name: user.name, age: user.age, books: user.books } }
      );

      if (modifiedCount === 0) {
        return new Response("User not found", { status: 404 });
      }

      return new Response("OK", { status: 200 });
    } else if (path === "/book") {
      const book = await req.json();
      if (!book.id || !book.title || !book.pages) {
        return new Response("Bad request", { status: 400 });
      }

      const { modifiedCount } = await booksCollection.updateOne(
        { _id: new ObjectId(book.id as string) },
        { $set: { title: book.title, pages: book.pages } }
      );

      if (modifiedCount === 0) {
        return new Response("Book not found", { status: 404 });
      }

      return new Response("OK", { status: 200 });
    }
  } else if (method === "DELETE") {
    if (path === "/user") {
      const id = url.searchParams.get("id");
      if (!id) return new Response("Bad request", { status: 400 });
      const { deletedCount } = await usersCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (deletedCount === 0) {
        return new Response("User not found", { status: 404 });
      }

      return new Response("OK", { status: 200 });
    } else if (path === "/book") {
      const id = url.searchParams.get("id");
      if (!id) return new Response("Bad request", { status: 400 });
      const { deletedCount } = await booksCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (deletedCount === 0) {
        return new Response("Book not found", { status: 404 });
      }

      const users = await usersCollection
        .find({ books: new ObjectId(id) })
        .toArray();
      await Promise.all(
        users.map((u) =>
          usersCollection.updateOne(
            { _id: u._id },
            { $pull: { books: new ObjectId(id) } }
          )
        )
      );

      return new Response("OK", { status: 200 });
    }
  }

  return new Response("endpoint not found", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
