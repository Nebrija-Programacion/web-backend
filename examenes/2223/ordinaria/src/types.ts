// types from rickyandmortyapi.com REST API

export type CharacterAPIRest = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  created: string;
};

export type LocationAPIRest = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  created: string;
};

export type EpisodeAPIRest = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  created: string;
};
