import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { booksCollection } from "../db/mongo.ts";

type DeleteBookContext = RouterContext<
  "/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteBook = async (context: DeleteBookContext) => {
  if (context.params?.id) {
    const count = await booksCollection.deleteOne({
      _id: new ObjectId(context.params.id),
    });
    if (count) {
      context.response.status = 200;
    } else {
      context.response.status = 404;
    }
  }
};
