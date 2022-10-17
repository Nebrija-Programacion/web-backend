import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

type Book = {
  id: string;
  title: string;
  author: string;
};

let books: Book[] = [
  {
    id: "1",
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "2",
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const router = new Router();

router
  .get("/books", (context) => {
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
