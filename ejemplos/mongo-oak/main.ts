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

const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("bookstore");

const router = new Router();

router
  .get("/books", async (context) => {
    const params = getQuery(context, { mergeParams: true });
    if (params?.sort === "desc") {
      const books = await db
        .collection<BookSchema>("books")
        .find({})
        .sort({ title: -1 });
      context.response.body = books.map((book) => ({
        id: book._id,
        title: book.title,
        auhtor: book.author,
      }));
      return;
    } else if (params?.sort === "asc") {
      const books = await db
        .collection<BookSchema>("books")
        .find({})
        .sort({ title: 1 });
      context.response.body = books.map((book) => ({
        id: book._id,
        title: book.title,
        auhtor: book.author,
      }));
    }

    const books = await db.collection<BookSchema>("books").find({});
    context.response.body = books.map((book) => ({
      id: book._id,
      title: book.title,
      auhtor: book.author,
    }));
    context.response.body = books;
  })
  .get("/books/:id", (context) => {
    if (context.params?.id) {
      const book: Book | undefined = books.find(
        (book) => book.id === context.params.id
      );

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
    const book: Book = {
      id: new Date().toISOString(),
      title: value.title,
      author: value.author,
    };
    books.push(book);
  })
  .delete("/books/:id", (context) => {
    if (
      context.params?.id &&
      books.find((book) => book.id === context.params.id)
    ) {
      books = books.filter((book) => book.id !== context.params.id);
      context.response.status = 200;
      return;
    }
    context.response.status = 404;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
