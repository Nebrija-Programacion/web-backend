import { Context } from "https://deno.land/x/oak@v6.3.1/mod.ts";

// Mongo Schemas
export interface CharacterSchema {
  _id: { $oid: string };
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: number;
  location: number;
  image: string;
  episode: number[];
}

export interface LocationSchema {
  _id: { $oid: string };
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: number[];
}

export interface EpisodeSchema {
  _id: { $oid: string };
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: number[];
}

// Data Types
export interface ICharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: string;
  location: string;
  image: string;
  episode: string[];
}

export interface ILocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

export interface IEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

// deno-lint-ignore no-explicit-any
export type IContext = Context<Record<string, any>>