export type FromWeatherApiLocalData = {
  weather: string;
  localTime: string;
  city: string;
  country: string;
};

const getLocalData = async (
  latitude: string,
  longitude: string
): Promise<FromWeatherApiLocalData> => {
  const BASE_URL = "http://api.weatherapi.com/v1";
  const WEATHERAPI_API_KEY = Deno.env.get("WEATHERAPI_API_KEY");
  if (!WEATHERAPI_API_KEY) {
    throw new Error("WEATHERAPI_API_KEY is not defined");
  }

  const url = `${BASE_URL}/current.json?key=${WEATHERAPI_API_KEY}&q=${latitude},${longitude}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Cannot fetch weather");
  }
  const data = await response.json();
  return {
    city: data.location.name,
    country: data.location.country,
    weather: data.current.condition.text,
    localTime: data.location.localtime,
  };
};

export default getLocalData;
