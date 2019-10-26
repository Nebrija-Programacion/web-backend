import fs from "fs";
import request from "request";

const fetchData = function(callback) {
  fetchPeople(callback);
};

const fetchPeople = function(callback, url, peopleData) {
  try {
    const peopleData = JSON.parse(fs.readFileSync(`people.json`).toString());
    fetchFilms(callback, peopleData);
  } catch (e) {
    if (!url) url = "https://swapi.co/api/people/?format=json";
    if (!peopleData) peopleData = [];
    console.log(`Fetching data from ${url}`);
    request({ url, json: true }, (error, response) => {
      if (response.body) {
        peopleData = [...peopleData, ...response.body.results];
      }

      if (response.body.next) {
        fetchPeople(callback, response.body.next, peopleData);
      } else {
        fs.writeFileSync("people.json", JSON.stringify(peopleData));
        fetchFilms(callback, peopleData);
      }
    });
  }
};

const fetchFilms = function(callback, peopleData, url, filmsData) {
  try {
    const filmsData = JSON.parse(fs.readFileSync(`films.json`).toString());
    callback(peopleData, filmsData);
  } catch (e) {
    if (!url) url = "https://swapi.co/api/films/?format=json";
    if (!filmsData) filmsData = [];

    console.log(`Fetching data from ${url}`);

    request({ url, json: true }, (error, response) => {
      if (response.body) {
        filmsData = [...filmsData, ...response.body.results];
      }

      if (response.body.next) {
        fetchFilms(callback, response.body.next, peopleData);
      } else {
        fs.writeFileSync("films.json", JSON.stringify(filmsData));
        // this callback will be runApp()
        callback(peopleData, filmsData);
      }
    });
  }
};

export { fetchData };
