import request from 'request';

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

const fetchData = (url, data) => {
  if (!data) data = [];
  console.log('fechting data...');
  request({ url, json: true }, (error, response) => {
    if (response.body) {
      data = [...data, ...response.body.results];
    }
    if (response.body.info.next !== '')
      fetchData(response.body.info.next, data);
    else runApp(data);
  });
};

// main program
fetchData(url);
