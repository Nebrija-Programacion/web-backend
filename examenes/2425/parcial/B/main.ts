import { Db, MongoClient, ObjectId } from "mongodb";
import { AuthorModel, BookModel } from "./types.ts";
import { fromBookModelToBook, verifyAuthors } from "./utils.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.error("Please provide a MONGO_URL");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected to MongoDB");

const db: Db = client.db("libros");

const BooksCollection = db.collection<BookModel>("books");
const AuthorsCollection = db.collection<AuthorModel>("authors");

const handler = async (request: Request): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname;

  if (method === "GET") {
    if (path === "/libros") {
      const titulo = url.searchParams.get("titulo");
      if (titulo) {
        const librosModels = await BooksCollection.find({
          title: { $regex: titulo, $options: "i" },
        }).toArray();
        const libros = await Promise.all(
          librosModels.map((bookModel) =>
            fromBookModelToBook(bookModel, AuthorsCollection)
          ),
        );
        return new Response(JSON.stringify(libros), {
          headers: { "content-type": "application/json" },
        });
      } else {
        const librosModels = await BooksCollection.find({}).toArray();
        const libros = await Promise.all(
          librosModels.map((bookModel) =>
            fromBookModelToBook(bookModel, AuthorsCollection)
          ),
        );
        return new Response(JSON.stringify(libros), {
          headers: { "content-type": "application/json" },
        });
      }
    }
    if (path === "/libro") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Please provide an id" }), {
          status: 400,
        });
      }

      const bookModel = await BooksCollection.findOne({ _id: { $oid: id } });
      if (!bookModel) {
        return new Response(JSON.stringify({ error: "Book not found" }), {
          status: 404,
        });
      }

      const book = await fromBookModelToBook(bookModel, AuthorsCollection);
      return new Response(JSON.stringify(book), {
        headers: { "content-type": "application/json" },
      });
    }
  } else if (method === "POST") {
    if (path === "/libro") {
      const body = await request.json();
      const { title, authors, numberOfCopies } = body;
      if (!title || !authors) {
        return new Response(
          JSON.stringify({
            error: "El título y los autores son campos requeridos.",
          }),
          {
            status: 400,
          },
        );
      }

      // check authors exist
      if (!(await verifyAuthors(authors, AuthorsCollection))) {
        return new Response(
          JSON.stringify({ error: "Alguno de los autores no existe." }),
          {
            status: 400,
          },
        );
      }

      const { insertedId } = await BooksCollection.insertOne({
        title,
        authors: authors.map((id: string) => new ObjectId(id)),
        numberOfCopies: numberOfCopies || 0,
      });

      const book = await fromBookModelToBook(
        {
          _id: insertedId,
          title,
          authors: authors.map((id: string) => new ObjectId(id)),
          numberOfCopies: numberOfCopies || 0,
        },
        AuthorsCollection,
      );
      return new Response(
        JSON.stringify({
          message: "Libro creado exitosamente",
          libro: book,
        }),
        {
          headers: { "content-type": "application/json" },
        },
      );
    } else if (path === "/autor") {
      const body = await request.json();
      const { name, biography } = body;
      if (!name) {
        return new Response(
          JSON.stringify({ error: "El nombre es un campo requerido." }),
          {
            status: 400,
          },
        );
      }

      const { insertedId } = await AuthorsCollection.insertOne({
        name,
        biography: biography || "",
      });

      return new Response(
        JSON.stringify({
          message: "Autor creado exitosamente",
          autor: {
            id: insertedId,
            name,
            biography: biography || "",
          },
        }),
        {
          headers: { "content-type": "application/json" },
        },
      );
    }
  } else if (method === "PUT") {
    if (path === "/libro") {
      const body = await request.json();
      const { id, title, authors, numberOfCopies } = body;
      if (!id) {
        return new Response(JSON.stringify({ error: "Please provide an id" }), {
          status: 400,
        });
      }

      // check authors exist
      if (authors && !(await verifyAuthors(authors, AuthorsCollection))) {
        return new Response(
          JSON.stringify({ error: "Alguno de los autores no existe." }),
          {
            status: 400,
          },
        );
      }

      const { modifiedCount } = await BooksCollection.updateOne(
        { _id: new ObjectId(id as string) },
        {
          $set: {
            title,
            authors: authors?.map((id: string) => new ObjectId(id)),
            numberOfCopies: numberOfCopies || 0,
          },
        },
      );

      if (modifiedCount === 0) {
        return new Response(JSON.stringify({ error: "Book not found" }), {
          status: 404,
        });
      }

      const bookModel = await BooksCollection.findOne({
        _id: new ObjectId(id as string),
      });
      const book = await fromBookModelToBook(bookModel!, AuthorsCollection);
      return new Response(
        JSON.stringify({
          message: "Libro actualizado exitosamente",
          libro: book,
        }),
        {
          headers: { "content-type": "application/json" },
        },
      );
    }
  } else if (method === "DELETE") {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "El ide es necesario" }), {
        status: 400,
      });
    }

    const { deletedCount } = await BooksCollection.deleteOne({
      _id: new ObjectId(id as string),
    });

    if (deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Libro no encontrado" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Libro eliminado exitosamente" }),
      {
        headers: { "content-type": "application/json" },
      },
    );
  }

  return new Response(null, { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
