type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

type Loc = {
  name: string;
  url: string;
};

enum Gender {
  male = "Male",
  female = "Female",
  unknown = "Unknown",
}

enum Status {
  alive = "Alive",
  death = "Death",
  unknown = "Unknown",
}

type Character = {
  id: number;
  name: string;
  status: Status;
  species: string;
  type: string;
  gender: Gender;
  origin: Loc;
  location: Loc;
  image: string;
  episode: string[];
  url: string;
  created: string;
};

type CharactersData = {
  info: Info;
  results: Character[];
};

const fetchCharacters = async (
  page: number,
  name?: string
): Promise<CharactersData> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?page=${page}${
      name?.length ? `&name=${name}` : ""
    }`
  );
  const data = await response.json();
  return data;
};

const fetchAllCharacters = async (name?: string): Promise<Character[]> => {
  const numberOfPages = (await fetchCharacters(1, name)).info.pages;
  const pageNumbers: number[] = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i);
  }

  const characters = await Promise.all(
    pageNumbers.map((page) => fetchCharacters(page, name))
  );

  const allCharacters = characters.flatMap((character) => character.results);
  return allCharacters;
};

const fetchAllRicks__BAD = async (): Promise<Character[]> => {
  const allCharacters = await fetchAllCharacters();
  const ricks = allCharacters.filter((character) => character.name === "Rick");
  return ricks;
};

const fetchAllRicks__BETTER = async (): Promise<Character[]> => {
  const allRicks = await fetchAllCharacters("Rick");
  return allRicks;
};

const firsEpisodesAllRicks = async (): Promise<string[]> => {
  const allRicks = await fetchAllRicks__BETTER();
  const firstEpisodes = allRicks
    .map((rick) => rick.episode[0])
    .reduce((acc: string[], episode) => {
      if (!acc.includes(episode)) {
        acc.push(episode);
      }
      return acc;
    }, []);
  return firstEpisodes;
};

const firsEpisodes = await firsEpisodesAllRicks();

// name of the first episode of each Rick
const firstEpisodesNames = await Promise.all(
  firsEpisodes.map(async (episode) => {
    const response = await fetch(episode);
    const data = await response.json();
    return data.name;
  })
);

console.log(firstEpisodesNames);
