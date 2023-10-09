import { Location } from "./types.ts";

export const getLocation = async (
  zipcode: string,
  countrycode: string = "ES"
): Promise<Location> => {
  const BASE_URL = "https://zip-api.eu/api/v1";
  const url = `${BASE_URL}/info/${countrycode}-${zipcode}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Cannot fetch location");
  }

  const data = await response.json();

  return {
    country: countrycode,
    city: data.state,
    zipcode: zipcode,
  };
};
