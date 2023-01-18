import { ObjectId } from "mongo";
import * as bcrypt from "bcrypt";

import {
  MatchCollection,
  PlayerCollection,
  TeamCollection,
  UserCollection,
} from "../db/db.ts";
import {
  MatchSchema,
  PlayerSchema,
  TeamSchema,
  UserSchema,
} from "../db/schema.ts";
import { MatchStatus, User } from "../types.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";

export const Mutation = {
  createUser: async (
    _: unknown,
    args: { mail: string; password: string }
  ): Promise<UserSchema> => {
    try {
      const { mail, password } = args;
      const exists = await UserCollection.findOne({
        mail,
      });
      if (exists) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password);

      const _id = await UserCollection.insertOne({
        mail,
        password: hashedPassword,
      });
      return {
        _id,
        mail,
        password,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    _: unknown,
    args: { mail: string; password: string }
  ): Promise<Omit<User, "password">> => {
    try {
      const { mail, password } = args;
      const user = await UserCollection.findOne({
        mail,
      });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }
      const token = await createJWT(
        { mail, id: user._id.toString() },
        Deno.env.get("JWT_SECRET") || ""
      );
      return {
        token,
        id: user._id.toString(),
        mail: user.mail,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  createTeam: async (
    _: unknown,
    args: {
      name: string;
      players: string[];
      classified: boolean;
      token: string;
    }
  ): Promise<TeamSchema> => {
    try {
      const { name, players, classified, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }

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
        updatedBy: user._id,
      });
      return {
        _id,
        name,
        classified,
        players: players.map((p) => new ObjectId(p)),
        updatedBy: user._id,
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
      token: string;
    }
  ): Promise<TeamSchema> => {
    try {
      const { id, players, classified, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }

      const _id = new ObjectId(id);
      let set: object = { updatedBy: user._id };
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
  deleteTeam: async (
    _: unknown,
    args: { id: string; token: string }
  ): Promise<TeamSchema> => {
    try {
      const { id, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
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
      token: string;
    }
  ): Promise<MatchSchema> => {
    try {
      const { team1, team2, goals_team1, goals_team2, date, status, token } =
        args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
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
        updatedBy: user._id,
      });
      return {
        _id,
        team1: new ObjectId(team1),
        team2: new ObjectId(team2),
        goals_team1,
        goals_team2,
        date,
        status,
        updatedBy: user._id,
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
      token: string;
    }
  ): Promise<MatchSchema> => {
    try {
      const { id, goals_team1, goals_team2, status, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
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
            updatedBy: user._id,
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
    args: { id: string; token: string }
  ): Promise<MatchSchema> => {
    try {
      const { id, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
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
    args: { name: string; token: string }
  ): Promise<PlayerSchema> => {
    try {
      const { name, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
      const _id = await PlayerCollection.insertOne({
        name,
        updatedBy: user._id,
      });
      return {
        _id,
        name,
        updatedBy: user._id,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deletePlayer: async (
    _: unknown,
    args: { id: string; token: string }
  ): Promise<PlayerSchema> => {
    try {
      const { id, token } = args;
      const user: UserSchema = (await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || ""
      )) as UserSchema;
      if (!user) {
        throw new Error("Invalid token");
      }
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
