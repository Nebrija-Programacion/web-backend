import { PlayerCollection } from "../db/db.ts";
import { MatchCollection } from "../db/db.ts";
import { MatchSchema, PlayerSchema, TeamSchema } from "../db/schema.ts";

export const Team = {
  id: (parent: TeamSchema): string => parent._id.toString(),
  matches: async (parent: TeamSchema): Promise<MatchSchema[]> => {
    try {
      const matches = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();
      return matches;
    } catch (e) {
      throw new Error(e);
    }
  },
  players: async (parent: TeamSchema): Promise<PlayerSchema[]> => {
    try {
      const players = await PlayerCollection.find({
        _id: { $in: parent.players },
      }).toArray();
      return players;
    } catch (e) {
      throw new Error(e);
    }
  },
  goals_for: async (parent: TeamSchema): Promise<number> => {
    try {
      const matches = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();

      const goals = matches.reduce((acc, match) => {
        if (match.team1.toString() === parent._id.toString()) {
          return acc + match.goals_team1;
        } else {
          return acc + match.goals_team2;
        }
      }, 0);
      return goals;
    } catch (e) {
      throw new Error(e);
    }
  },
  goals_against: async (parent: TeamSchema): Promise<number> => {
    try {
      const matches = await MatchCollection.find({
        $or: [{ team1: parent._id }, { team2: parent._id }],
      }).toArray();

      const goals = matches.reduce((acc, match) => {
        if (match.team1.toString() === parent._id.toString()) {
          return acc + match.goals_team2;
        } else {
          return acc + match.goals_team1;
        }
      }, 0);
      return goals;
    } catch (e) {
      throw new Error(e);
    }
  },
};
