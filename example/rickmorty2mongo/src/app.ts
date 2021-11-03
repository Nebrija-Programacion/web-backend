import { Db } from "mongodb";
import { getAndSaveRickyMortyCharacters } from "./populatedb";
import express from "express";
import { character, characters } from "./resolvers";

const run = async () => {
  const db: Db = await getAndSaveRickyMortyCharacters();
  const app = express();
  app.set("db", db);

  app.get("/status", async (req, res) => {
    res.status(200).send("Todo OK");
  });

  app.get("/characters", characters);
  app.get("/character/:id", character);

  //app.get("/character/:id", character);

  await app.listen(3000);
};

try {
  run();
} catch (e) {
  console.error(e);
}
