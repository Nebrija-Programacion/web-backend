import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import { Context, helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import {
  CharacterSchema,
  LocationSchema,
  EpisodeSchema,
  ICharacter,
} from "../types.ts";

import type { IContext } from "../types.ts";

const getCharacter = async (ctx: IContext) => {
  try {
    const db: Database = ctx.state.db;
    const charactersCollection = db.collection<CharacterSchema>(
      "CharactersCollection"
    );
    const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
    const locationsCollection = db.collection<LocationSchema>(
      "LocationsCollection"
    );

    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    // retrieve all character with ID
    const character = await charactersCollection.findOne({ id: Number(id) });
    if (!character) {
      ctx.response.status = 404;
      ctx.response.body = "Character not found.";
      return;
    }

    // map origin, location and episodes ids to names
    let location: Partial<LocationSchema> | null = await locationsCollection.findOne({ id: character!.location });
    
    if (!location) {
      location = { name: "Unknown" };
    }

    let origin:Partial<LocationSchema> | null = await locationsCollection.findOne({ id: character!.origin, });
    if (!origin) {
      origin = { name: "Unknown" };
    }

    const episode = await episodesCollection.find({
      id: { $in: character!.episode },
    });

    if (episode.length !== character!.episode.length) {
      throw new Error("Episode id not found.");
    }

    ctx.response.status = 200;
    ctx.response.body = {
      ...character,
      location: location!.name,
      origin: origin!.name,
      episode: episode.map((ep) => ep.name),
    };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = `Unexpected Error: ${e.message}`;
  }  
};

export { getCharacter as default };
