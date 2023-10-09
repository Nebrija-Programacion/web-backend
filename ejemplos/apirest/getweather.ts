import { Weather, Location } from "./types.ts";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
const env = await load();

export const getWeather = async (location: Location): Promise<Weather> => {
  const BASE_URL = "http://api.weatherapi.com/v1";
  const WEATHERAPI_API_KEY = env["WEATHERAPI_API_KEY"];
  const url = `${BASE_URL}/current.json?key=${WEATHERAPI_API_KEY}&q=${location.city}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Cannot fetch weather");
  }
  const data = await response.json();
  return {
    location,
    temperature: data.current.temp_c,
    description: data.current.condition.text,
  };
};
