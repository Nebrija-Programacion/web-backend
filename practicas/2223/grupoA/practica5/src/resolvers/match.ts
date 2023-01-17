import { TeamCollection, UserCollection } from "../db/db.ts";
import { TeamSchema, UserSchema } from "../db/schema.ts";
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
  updatedBy: async (parent: MatchSchema): Promise<UserSchema> => {
    try {
      const user = await UserCollection.findOne({ _id: parent.updatedBy });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      throw new Error(e);
    }
  },
};
