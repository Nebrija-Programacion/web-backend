import { Request, Response } from "npm:express@4.18.2";

type Character = {
  name: string;
  episodes: string[];
};

type CharacterFromAPI = {
  name: string;
  episode: string[];
};

const getCharacter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`
    );
    if (response.status !== 200) {
      res.status(response.status).send(response.statusText);
      return;
    }

    const character: CharacterFromAPI = await response.json();

    const episodes = await Promise.all(
      character.episode.map(async (episode) => {
        const response = await fetch(episode);
        if (response.status !== 200) {
          throw new Error(`Episode ${episode} not found`);
        }
        const episodeData = await response.json();
        return episodeData.name;
      })
    );
    res.send({
      name: character.name,
      episodes,
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getCharacter;
