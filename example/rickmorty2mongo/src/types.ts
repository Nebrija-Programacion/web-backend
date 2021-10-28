export type CharacterAPI = {
  id: string;
  name: string;
  status: string;
  species: string;
  episode: [string];
};

export type EpisodeAPI = {
  name: string;
  episode: string;
};

export type Character = Omit<CharacterAPI, "episode"> & {
  episode: Array<EpisodeAPI>;
};
export type Episode = EpisodeAPI;
