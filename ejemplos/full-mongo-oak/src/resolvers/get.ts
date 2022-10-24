import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { booksCollection } from "../db/mongo.ts";
import { BookSchema } from "../db/schemas.ts";

type GetBooksContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetBookContext = RouterContext<
  "/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
  const params = getQuery(context, { mergeParams: true });
  if (params?.sort === "desc") {
    const books = await booksCollection.find({}).sort({ title: -1 }).toArray();
    context.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      auhtor: book.author,
    }));
    return;
  } else if (params?.sort === "asc") {
    const books = await booksCollection.find({}).sort({ title: 1 }).toArray();
    context.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      auhtor: book.author,
    }));
  }

  const books = await booksCollection.find({}).toArray();
  context.response.body = books.map((book) => ({
    id: book._id.toString(),
    title: book.title,
    auhtor: book.author,
  }));
};

export const getBook = async (context: GetBookContext) => {
  if (context.params?.id) {
    const book: BookSchema | undefined = await booksCollection.findOne({
      _id: new ObjectId(context.params.id),
    });

    if (book) {
      context.response.body = book;
      return;
    }
  }

  context.response.status = 404;
};
