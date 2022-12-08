import { TeamCollection } from "../db/db.ts";
import { TeamSchema } from "../db/schema.ts";
import { MatchSchema } from "../db/schema.ts";

export const Match = {
  id: (parent: MatchSchema): string => parent._id.toString(),
  team1: async (parent: MatchSchema): Promise<TeamSchema> => {
    try {
      const team = await TeamCollection.findOne({ _id: parent.team1 });
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (e) {
      throw new Error(e);
    }
  },
  team2: async (parent: MatchSchema): Promise<TeamSchema> => {
    try {
      const team = await TeamCollection.findOne({ _id: parent.team2 });
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (e) {
      throw new Error(e);
    }
  },
};
