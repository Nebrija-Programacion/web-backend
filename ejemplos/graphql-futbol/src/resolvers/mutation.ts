import { ObjectId } from "mongo";
import { MatchCollection, PlayerCollection, TeamCollection } from "../db/db.ts";
import { MatchSchema, PlayerSchema, TeamSchema } from "../db/schema.ts";
import { MatchStatus } from "../types.ts";

export const Mutation = {
  createTeam: async (
    _: unknown,
    args: { name: string; players: string[]; classified: boolean }
  ): Promise<TeamSchema> => {
    try {
      const { name, players, classified } = args;
      const exists = await TeamCollection.findOne({
        name,
      });
      if (exists) {
        throw new Error("Team already exists");
      }

      const _id = await TeamCollection.insertOne({
        name,
        classified,
        players: players.map((p) => new ObjectId(p)),
      });
      return {
        _id,
        name,
        classified,
        players: players.map((p) => new ObjectId(p)),
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  updateTeam: async (
    _: unknown,
    args: {
      id: string;
      players?: string[];
      classified?: boolean;
    }
  ): Promise<TeamSchema> => {
    try {
      const { id, players, classified } = args;
      const _id = new ObjectId(id);
      let set = {};
      if (players) {
        set = { ...set, players: players?.map((p) => new ObjectId(p)) };
      }
      if (classified) {
        set = { ...set, classified };
      }
      const team = await TeamCollection.updateOne(
        { _id },
        {
          $set: set,
        }
      );

      if (team.matchedCount === 0) {
        throw new Error("Team not found");
      }

      return (await TeamCollection.findOne({
        _id,
      })) as TeamSchema;
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteTeam: async (_: unknown, args: { id: string }): Promise<TeamSchema> => {
    try {
      const { id } = args;
      const _id = new ObjectId(id);
      const team = await TeamCollection.findOne({
        _id,
      });
      if (!team) {
        throw new Error("Team not found");
      }
      await TeamCollection.deleteOne({ _id });
      return team;
    } catch (e) {
      throw new Error(e);
    }
  },

  createMatch: async (
    _: unknown,
    args: {
      team1: string;
      team2: string;
      goals_team1: number;
      goals_team2: number;
      date: Date;
      status: MatchStatus;
    }
  ): Promise<MatchSchema> => {
    try {
      const { team1, team2, goals_team1, goals_team2, date, status } = args;
      const exists = await MatchCollection.findOne({
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        date,
      });
      if (exists) {
        throw new Error("Match already exists");
      }

      const _id = await MatchCollection.insertOne({
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        goals_team1,
        goals_team2,
        date,
        status,
      });
      return {
        _id,
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        goals_team1,
        goals_team2,
        date,
        status,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  updateMatch: async (
    _: unknown,
    args: {
      id: string;
      goals_team1: number;
      goals_team2: number;
      status: MatchStatus;
    }
  ): Promise<MatchSchema> => {
    try {
      const { id, goals_team1, goals_team2, status } = args;
      const _id = new ObjectId(id);
      const match = await MatchCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            goals_team1,
            goals_team2,
            status,
          },
        }
      );
      if (match.matchedCount === 0) {
        throw new Error("Match not found");
      }
      return (await MatchCollection.findOne({
        _id,
      })) as MatchSchema;
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteMatch: async (
    _: unknown,
    args: { id: string }
  ): Promise<MatchSchema> => {
    try {
      const { id } = args;
      const _id = new ObjectId(id);
      const match = await MatchCollection.findOne({
        _id,
      });
      if (!match) {
        throw new Error("Match not found");
      }
      await MatchCollection.deleteOne({ _id });
      return match;
    } catch (e) {
      throw new Error(e);
    }
  },
  createPlayer: async (
    _: unknown,
    args: { name: string }
  ): Promise<PlayerSchema> => {
    try {
      const { name } = args;
      const _id = await PlayerCollection.insertOne({
        name,
      });
      return {
        _id,
        name,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deletePlayer: async (
    _: unknown,
    args: { id: string }
  ): Promise<PlayerSchema> => {
    try {
      const { id } = args;
      const _id = new ObjectId(id);
      const player = await PlayerCollection.findOne({
        _id,
      });
      if (!player) {
        throw new Error("Player not found");
      }
      await PlayerCollection.deleteOne({
        _id,
      });
      return player;
    } catch (e) {
      throw new Error(e);
    }
  },
};
