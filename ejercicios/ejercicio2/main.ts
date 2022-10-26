import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import {
  Application,
  Router,
  helpers,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";

type Author = {
  name: string;
  birth_year?: number;
  death_year?: number;
};
type Book = {
  id: string;
  title: string;
  authors?: Author[];
};

type BookData = {
  results: Book[];
};

const router = new Router();

router
  .get("/books", async (context) => {
    try {
      const booksData = await fetch("https://gutendex.com/books/");
      const booksJSON: BookData = await booksData.json();
      const books: Book[] = booksJSON.results;
      context.response.body = books.map((book) => ({
        title: book.title,
        id: book.id,
      }));
    } catch (e) {
      console.error(e);
      context.response.status = 500;
      context.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .get("/books/:page", async (context) => {
    try {
      if (context.params?.page) {
        const booksData = await fetch(
          `https://gutendex.com/books/?page=${context.params.page}`
        );
        const booksJSON: BookData = await booksData.json();
        const books: Book[] = booksJSON.results;
        context.response.body = books.map((book) => ({
          title: book.title,
          id: book.id,
        }));
      }
    } catch (e) {
      console.error(e);
      context.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .get("/book/:id", async (context) => {
    if (context.params?.id) {
      const bookData = await fetch(
        `https://gutendex.com/books/${context.params.id}`
      );
      const book: Book = await bookData.json();
      if (book) {
        const { title, id, authors } = book;
        context.response.body = { title, id, authors };
      } else {
        context.response.status = 404;
        context.response.body = {
          message: "Book not found",
        };
      }
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
