import { Db } from "mongodb";
import { connectDB } from "./mongo";
import express from "express";
import { book, free, freeSeats, status } from "./resolvers";

const run = async () => {
  const db: Db = await connectDB();
  const app = express();
  app.set("db", db);

  app.use((req, res, next) => {
    next();
  });
  app.get("/status", status);
  app.get("/freeSeats", freeSeats);
  app.post("/book", book);
  app.post("/free", free);

  await app.listen(3000);
};

try {
  run();
} catch (e) {
  console.error(e);
}
