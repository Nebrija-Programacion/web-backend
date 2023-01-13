import { CharacterAPIRest, EpisodeAPIRest } from "../types.ts";

export const Episode = {
  characters: async (
    parent: EpisodeAPIRest
  ): Promise<Array<CharacterAPIRest>> => {
    const characters = await Promise.all(
      parent.characters.map(async (character) => {
        const char = await fetch(character);
        return char.json();
      })
    );
    return characters;
  },
};
