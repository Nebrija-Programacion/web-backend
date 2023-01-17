import { ObjectId } from "mongo";
import { MatchCollection } from "../db/db.ts";
import { PlayerCollection } from "../db/db.ts";
import { TeamCollection } from "../db/db.ts";
import { MatchSchema } from "../db/schema.ts";
import { PlayerSchema } from "../db/schema.ts";
import { TeamSchema } from "../db/schema.ts";
import { MatchStatus } from "../types.ts";

export const Query = {
  teams: async (
    _: unknown,
    args: { classified?: boolean }
  ): Promise<TeamSchema[]> => {
    try {
      if (args.classified !== undefined) {
        return await TeamCollection.find({}).toArray();
      }

      const teams = await TeamCollection.find({
        classified: args.classified,
      }).toArray();
      return teams;
    } catch (e) {
      throw new Error(e);
    }
  },
  team: async (_: unknown, args: { id: string }): Promise<TeamSchema> => {
    try {
      const team = await TeamCollection.findOne({ _id: new ObjectId(args.id) });
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (e) {
      throw new Error(e);
    }
  },
  players: async (
    _: unknown,
    args: { team_id?: string }
  ): Promise<PlayerSchema[]> => {
    try {
      if (args.team_id) {
        const team = await TeamCollection.findOne({
          _id: new ObjectId(args.team_id),
        });
        if (!team) {
          throw new Error("Team not found");
        }
        return await PlayerCollection.find({
          _id: { $in: team.players },
        }).toArray();
      }

      const players = await PlayerCollection.find({}).toArray();
      return players;
    } catch (e) {
      throw new Error(e);
    }
  },
  player: async (_: unknown, args: { id: string }): Promise<PlayerSchema> => {
    try {
      const player = await PlayerCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!player) {
        throw new Error("Player not found");
      }
      return player;
    } catch (e) {
      throw new Error(e);
    }
  },
  matches: async (
    _: unknown,
    args: { status?: MatchStatus; team?: string; date?: Date }
  ): Promise<MatchSchema[]> => {
    try {
      let filter = {};
      if (args.status) {
        filter = { status: args.status };
      }

      if (args.team) {
        filter = {
          ...filter,
          $or: [
            { team1: new ObjectId(args.team) },
            { team2: new ObjectId(args.team) },
          ],
        };
      }

      if (args.date) {
        filter = { ...filter, date: args.date };
      }

      const matches = await MatchCollection.find(filter).toArray();
      return matches;
    } catch (e) {
      throw new Error(e);
    }
  },
  match: async (_: unknown, args: { id: string }): Promise<MatchSchema> => {
    try {
      const match = await MatchCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!match) {
        throw new Error("Match not found");
      }
      return match;
    } catch (e) {
      throw new Error(e);
    }
  },
};
