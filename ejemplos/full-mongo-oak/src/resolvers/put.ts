import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { booksCollection } from "../db/mongo.ts";

type PutBookContext = RouterContext<
  "/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putBook = async (context: PutBookContext) => {
  const db = context.state.dbclient.database("bookstore") as Database;
  if (context.params?.id) {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.title && !value?.author) {
      context.response.status = 400;
      return;
    }
    const count = await booksCollection.updateOne(
      { _id: new ObjectId(context.params.id) },
      {
        $set: {
          title: value.title,
          author: value.author,
        },
      }
    );
    if (count) {
      const book = await booksCollection.findOne({
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
};
