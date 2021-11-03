import { getCharacters } from "./rickmortyapi";
import { Character } from "./types";
import { Db, MongoClient } from "mongodb";

export const getAndSaveRickyMortyCharacters = async (): Promise<Db> => {
  const dbName: string = "RickyMorty";
  const collection: string = "Characters";

  const usr = "avalero";
  const pwd = "******";
  const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster-nebrija.gcxdd.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");
    const docs = await client
      .db(dbName)
      .collection(collection)
      .countDocuments();
    if (docs > 0) {
      console.info("Characters are already in the DB");
      return client.db(dbName);
    }

    console.info("Empty DB. Populating...");

    let next: string = "https://rickandmortyapi.com/api/character";
    while (next) {
      const data: { next: string; characters: Character[] } =
        await getCharacters(next);
      const characters = data.characters.map((char) => {
        const { id, name, status, species, episode } = char;
        return {
          id,
          name,
          status,
          species,
          episode,
        };
      });
      await client.db(dbName).collection(collection).insertMany(characters);
      next = data.next;
      console.log(next);
    }

    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};
