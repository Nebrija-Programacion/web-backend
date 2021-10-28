import { getCharacters } from "./rickmortyapi";
import { Character } from "./types";

const run = async () => {
  let next: string = "https://rickandmortyapi.com/api/character";
  while (next) {
    const data: { next: string; characters: Character[] } = await getCharacters(
      next
    );
    const characters = data.characters.map((char) => {
      const { id, name, status, species, episode } = char;
      return {
        id,
        name,
        status,
        species,
        episode,
      };
    });

    // ADD CHARACTERS HERE TO THE DATABASE, AND GO FOR THE NEXT PAGE
    next = data.next;
    console.log(next);
  }
};

try {
  run();
} catch (e) {
  console.error(e);
}
