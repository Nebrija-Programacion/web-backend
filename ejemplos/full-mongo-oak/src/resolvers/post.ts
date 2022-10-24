import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BookSchema } from "../db/schemas.ts";
import { Book } from "../types.ts";
import { booksCollection } from "../db/mongo.ts";

type PostBooksContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBooks = async (context: PostBooksContext) => {
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
  const id = await booksCollection.insertOne(book as BookSchema);
  book.id = id.toString();
  context.response.body = {
    id: book.id,
    title: book.title,
    author: book.author,
  };
};
