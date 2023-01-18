import { Match, Player, Team, User } from "../types.ts";
import { ObjectId } from "mongo";

export type TeamSchema = Omit<
  Team,
  "id" | "matches" | "players" | "goals_for" | "goals_against" | "updatedBy"
> & {
  _id: ObjectId;
  players: ObjectId[];
  updatedBy: ObjectId;
};

export type MatchSchema = Omit<
  Match,
  "id" | "team1" | "team2" | "updatedBy"
> & {
  _id: ObjectId;
  team1: ObjectId;
  team2: ObjectId;
  updatedBy: ObjectId;
};

export type PlayerSchema = Omit<Player, "id" | "team" | "updatedBy"> & {
  _id: ObjectId;
  updatedBy: ObjectId;
};

export type UserSchema = Omit<User, "id" | "token"> & {
  _id: ObjectId;
};
