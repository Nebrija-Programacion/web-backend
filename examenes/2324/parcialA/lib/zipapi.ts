export type FromZipLocationData = {
  latitude: string;
  longitude: string;
};

const getLocationFromZipAndCountry = async (
  zip: string,
  countrycode: string
): Promise<FromZipLocationData> => {
  const API_URL = "https://zip-api.eu/api/v1";
  const url = `${API_URL}/info/${countrycode.toUpperCase()}-${zip}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Invalid zip or country code");
  }
  const data = await response.json();
  return {
    latitude: data.lat,
    longitude: data.lng,
  };
};

export default getLocationFromZipAndCountry;
