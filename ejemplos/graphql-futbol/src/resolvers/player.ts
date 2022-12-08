import { TeamCollection } from "../db/db.ts";
import { TeamSchema } from "../db/schema.ts";
import { PlayerSchema } from "../db/schema.ts";

export const Player = {
  id: (parent: PlayerSchema): string => parent._id.toString(),
  team: async (parent: PlayerSchema): Promise<TeamSchema | undefined> => {
    try {
      const team = await TeamCollection.findOne({
        players: parent._id,
      });
      return team;
    } catch (e) {
      throw new Error(e);
    }
  },
};
