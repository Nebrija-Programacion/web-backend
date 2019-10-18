import { fetchData } from './fetchdata';

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

/**
 * Main App
 * @param data all rickyandmorty database
 */
const runApp = data => {
  data.forEach(element => {
    console.log(`${element.id}: ${element.name}`);
  });
};

// main program
fetchData(runApp, url);
