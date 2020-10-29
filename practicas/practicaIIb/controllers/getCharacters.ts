import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { CharacterSchema, LocationSchema, EpisodeSchema, ICharacter } from "../types.ts";
import type { IContext } from "../types.ts";

const getCharacters = async (ctx: IContext) => {
  try {
    const db: Database = ctx.state.db;
    const charactersCollection = db.collection<CharacterSchema>(
      "CharactersCollection"
    );
    const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
    const locationsCollection = db.collection<LocationSchema>(
      "LocationsCollection"
    );

    // retrieve all characters
    const characters = await charactersCollection.find({ id: { $lt: 5 } });

    // map origin, location and episodes ids to names

    const result = characters.map(async (char) => {
      let origin:Partial<LocationSchema> | null = await locationsCollection.findOne({ id: char.origin });
      if (!origin) {
        origin = { name: "Unknown" }
      }

      let location:Partial<LocationSchema> | null = await locationsCollection.findOne({ id: char.location });
      if (!location) {
        location = {name: "Unknown" }
      }

      const episode = await episodesCollection.find({
        id: { $in: char.episode },
      });
      if (episode.length !== char.episode.length) {
        throw new Error("episode id not found");
      }

      return {
        ...char,
        location: location!.name,
        origin: origin!.name,
        episode: episode.map((ep) => ep.name),
      } as ICharacter;
    });
    ctx.response.status = 200;
    ctx.response.body = await Promise.all(result);
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = `Unexpected Error: ${e.message}`;
  }
};

export {getCharacters as default}