import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getBook, getBooks } from "./resolvers/get.ts";
import { postBooks } from "./resolvers/post.ts";
import { deleteBook } from "./resolvers/delete.ts";
import { putBook } from "./resolvers/put.ts";

const router = new Router();

router
  .get("/books", getBooks)
  .get("/books/:id", getBook)
  .post("/books", postBooks)
  .delete("/books/:id", deleteBook)
  .put("/books/:id", putBook);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
