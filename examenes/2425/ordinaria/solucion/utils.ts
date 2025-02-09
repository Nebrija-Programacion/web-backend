import { CityAPI, PhoneData, WeatherAPI, WorldTimeAPI } from "./types.ts";

export const getTemperature = async (
  lat: string,
  lon: string
): Promise<number> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data: WeatherAPI = await response.json();
  return data.temp;
};

const getCountryName = async (code: string): Promise<string> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/country?name=${code}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch country data");
  }

  const data = await response.json();
  return data.at(0).name;
};

export const getCityData = async (
  city: string
): Promise<Array<{ latitude: string; longitude: string; country: string }>> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/city?name=${city}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch geo data");
  }

  const data: CityAPI = await response.json();

  const result = await Promise.all(
    data.map(async (city) => {
      const country = await getCountryName(city.country);
      return { latitude: city.latitude, longitude: city.longitude, country };
    })
  );

  return result;
};

export const getWorldTime = async (
  latitude: string,
  longitude: string
): Promise<string> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/worldtime?lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch world time data");
  }

  const data: WorldTimeAPI = await response.json();
  return `${data.hour}:${data.minute}`;
};

export const getPhoneData = async (phone: string): Promise<PhoneData> => {
  const API_KEY = Deno.env.get("API_KEY");

  if (!API_KEY) {
    throw new Error("API_KEY is not defined");
  }

  const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch phone data");
  }

  return await response.json();
};
