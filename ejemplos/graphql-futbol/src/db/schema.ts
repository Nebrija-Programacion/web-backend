import { Match, Player, Team } from "../types.ts";
import { ObjectId } from "mongo";

export type TeamSchema = Omit<
  Team,
  "id" | "matches" | "players" | "goals_for" | "goals_against"
> & {
  _id: ObjectId;
  players: ObjectId[];
};

export type MatchSchema = Omit<Match, "id" | "team1" | "team2"> & {
  _id: ObjectId;
  team1: ObjectId;
  team2: ObjectId;
};

export type PlayerSchema = Omit<Player, "id" | "team"> & {
  _id: ObjectId;
};
