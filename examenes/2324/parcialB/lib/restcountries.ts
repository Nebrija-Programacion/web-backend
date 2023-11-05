export type FromRestCountriesLocationData = {
  country: string;
  continent: string;
};

const getLocationFromISOCode = async (
  isoCode: string
): Promise<FromRestCountriesLocationData> => {
  const API_URL = "https://restcountries.eu/rest/v2/";
  const url = `${API_URL}alpha/${isoCode}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Invalid ISO code");
  }

  const data = await response.json();
  if (data.length === 0) {
    throw new Error("Invalid ISO code");
  }

  return { country: data[0].name.common, continent: data[0].region };
};

export default getLocationFromISOCode;
