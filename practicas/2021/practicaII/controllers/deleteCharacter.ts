import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";
import {helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import {
  CharacterSchema,
} from "../types.ts";

import type { IContext } from "../types.ts";

const deleteCharacter = async (ctx: IContext) => {
  try {
    const db: Database = ctx.state.db;
    const charactersCollection = db.collection<CharacterSchema>(
      "CharactersCollection"
    );

    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    // retrieve all character with ID
    
    const character = await charactersCollection.deleteOne({ id: Number(id) });
    if (!character) {
      ctx.response.status = 404;
      ctx.response.body = "Character not found";
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = "OK"
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = `Unexpected Error: ${e.message}`;
  }
};
export { deleteCharacter as default };
