import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import {
  ObjectId,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

type Book = {
  id: string;
  title: string;
  author: string;
};

type BookSchema = Omit<Book, "id"> & { _id: ObjectId };

const mongo_usr = "avalero";
const mongo_pwd = "xxxxxxxxxxxx";
const db_name = "bookstore";
const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

const client = new MongoClient();
await client.connect(mongo_url);
const db = client.database(db_name);
console.log("Connected to DB");

const router = new Router();

router
  .get("/books", async (context) => {
    const params = getQuery(context, { mergeParams: true });
    if (params?.sort === "desc") {
      const books = await db
        .collection<BookSchema>("books")
        .find({})
        .sort({ title: -1 })
        .toArray();
      context.response.body = books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        auhtor: book.author,
      }));
      return;
    } else if (params?.sort === "asc") {
      const books = await db
        .collection<BookSchema>("books")
        .find({})
        .sort({ title: 1 })
        .toArray();
      context.response.body = books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        auhtor: book.author,
      }));
    }

    const books = await db.collection<BookSchema>("books").find({}).toArray();
    context.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      auhtor: book.author,
    }));
  })
  .get("/books/:id", async (context) => {
    if (context.params?.id) {
      const book: BookSchema | undefined = await db
        .collection<BookSchema>("books")
        .findOne({
          _id: new ObjectId(context.params.id),
        });

      if (book) {
        context.response.body = book;
        return;
      }
    }

    context.response.status = 404;
  })
  .post("/books", async (context) => {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.title || !value?.author) {
      context.response.status = 400;
      return;
    }
    const book: Partial<Book> = {
      title: value.title,
      author: value.author,
    };
    const id = await db
      .collection<BookSchema>("books")
      .insertOne(book as BookSchema);
    book.id = id.toString();
    context.response.body = book;
  })
  .delete("/books/:id", async (context) => {
    if (context.params?.id) {
      const count = await db.collection<BookSchema>("books").deleteOne({
        _id: new ObjectId(context.params.id),
      });
      if (count) {
        context.response.status = 200;
      } else {
        context.response.status = 404;
      }
    }
  })
  .put("/books/:id", async (context) => {
    if (context.params?.id) {
      const result = context.request.body({ type: "json" });
      const value = await result.value;
      if (!value?.title && !value?.author) {
        context.response.status = 400;
        return;
      }
      const count = await db.collection<BookSchema>("books").updateOne(
        { _id: new ObjectId(context.params.id) },
        {
          $set: {
            title: value.title,
            author: value.author,
          },
        }
      );
      if (count) {
        const book = await db.collection<BookSchema>("books").findOne({
          _id: new ObjectId(context.params.id),
        });
        context.response.body = {
          id: book?._id.toString(),
          title: book?.title,
          author: book?.author,
        };
        context.response.status = 200;
      } else {
        context.response.status = 404;
      }
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
