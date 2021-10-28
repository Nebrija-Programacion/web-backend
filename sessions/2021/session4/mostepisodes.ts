interface IEpisode {
  characters: string[];
}

interface IInfo {
  next?: string;
}

interface IData {
  info: IInfo;
  results: IEpisode[];
}

// fetch all episodes
const url = "https://rickandmortyapi.com/api/episode/";
let response = await fetch(url);
let data: IData = await response.json();
const episodes: IEpisode[] = data.results;
console.log(`Added ${data.results.length} episodes`);
while (data.info.next) {
  response = await fetch(data.info.next);
  data = await response.json();
  episodes.push(...data.results);
  console.log(`Added ${data.results.length} episodes`);
}

console.log(`Added in total ${episodes.length} episodes`);

// create object with all characters and the number of times they appear on an episode.
const characters: { [key: string]: number } = {};
episodes.forEach((episode) => {
  episode.characters.forEach((character) => {
    if (characters[character]) {
      characters[character] += 1;
    } else {
      characters[character] = 1;
    }
  });
});

// get max number of appearances

const maxCharacter: { url: string; num: number } = {
  url: "",
  num: 0,
};

Object.keys(characters).forEach((url) => {
  if (characters[url] > maxCharacter.num) {
    maxCharacter.url = url;
    maxCharacter.num = characters[url];
  }
});

console.log(maxCharacter);

// fetch data of most viewed character

response = await fetch(maxCharacter.url);
const maxCharacterData = await response.json();
console.log(maxCharacterData);
