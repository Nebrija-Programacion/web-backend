import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
const env = await load();

const ZIP_BASE_URL = env["ZIP_BASE_URL"];
const ZIP_API_KEY = env["ZIP_API_KEY"];

const WEATHERAPI_API_KEY = env["WEATHERAPI_API_KEY"];
const WEATHERAPI_BASE_URL = env["WEATHERAPI_BASE_URL"];

if (
  !ZIP_BASE_URL ||
  !ZIP_API_KEY ||
  !WEATHERAPI_API_KEY ||
  !WEATHERAPI_BASE_URL
) {
  throw new Error(
    "Please set ZIP_BASE_URL, ZIP_API_KEY, WEATHERAPI_API_KEY, WEATHERAPI_BASE_URL"
  );
}

type ZipAPI = {
  continent: { name: string; alpha2: string };
  country: {
    name: string;
    alpha2: string;
    alpha3: string;
    numeric: number;
    tld: string;
  };
  state: { name: string; alpha2: string };
  county: { name: string };
  city: { name: string };
  code: { name: string; latitude: string; longitude: string };
};

type WeatherAPI = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
};

// ask in deno for user input to introduce zip code
const zipCode = prompt("Enter your zip code");

// Documentation: http://parseapi.com/postalcode
const data = await fetch<ZipAPI>(`${ZIP_BASE_URL}/api/${ZIP_API_KEY}/28250`);
const zipJSON: ZipAPI = await data.json();

const city = zipJSON.city.name;
const country = zipJSON.country.name;

console.log(zipJSON);

console.log(city);

// get weather
const weatherData = await fetch<WeatherAPI>(
  `${WEATHERAPI_BASE_URL}/current.json?key=${WEATHERAPI_API_KEY}&q=${city}`
);
const weatherJson: WeatherAPI = await weatherData.json();
console.log(weatherJson);
