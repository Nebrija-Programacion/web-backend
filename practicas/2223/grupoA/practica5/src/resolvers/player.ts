import { TeamCollection, UserCollection } from "../db/db.ts";
import { TeamSchema, UserSchema } from "../db/schema.ts";
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

  updatedBy: async (parent: PlayerSchema): Promise<UserSchema> => {
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
