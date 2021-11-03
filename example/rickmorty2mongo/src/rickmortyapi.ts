import axios from "axios";
import { Character, Episode, EpisodeAPI, CharacterAPI } from "./types";

export const getEpisode = async (url: string): Promise<Episode> => {
  try {
    return (await axios.get<any, { data: EpisodeAPI }>(url)).data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getEpisodes = async (urls: string[]): Promise<Array<Episode>> => {
  try {
    return await Promise.all(urls.map((url) => getEpisode(url)));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getCharacters = async (
  url: string
): Promise<{
  next: string;
  characters: Character[];
}> => {
  try {
    const data: { info: { next: string }; results: CharacterAPI[] } = (
      await axios.get<
        any,
        { data: { info: { next: string }; results: CharacterAPI[] } }
      >(url)
    ).data;

    const charactersAPI: CharacterAPI[] = data.results;

    const characters: Character[] = await Promise.all(
      charactersAPI.map(async (charAPI) => {
        const episodes: Episode[] = await getEpisodes(charAPI.episode);
        return {
          ...charAPI,
          episode: episodes.map((epi) => {
            return {
              name: epi.name,
              episode: epi.episode,
            };
          }),
        };
      })
    );

    return {
      next: data.info.next,
      characters,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
