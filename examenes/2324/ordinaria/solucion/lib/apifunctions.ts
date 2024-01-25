type PhoneInfo = {
  is_valid: boolean;
  country: string;
};

type CountryInfo = {
  capital: string;
};

type CapitalInfo = {
  datetime: string;
};

export const getInformationFromPhone = async (
  phone: string
): Promise<PhoneInfo> => {
  const API_KEY = Deno.env.get("API_KEY");
  if (!API_KEY) {
    throw new Error("API_KEY not found");
  }

  const url = "https://api.api-ninjas.com/v1/validatephone?number=" + phone;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (data.status !== 200) {
    console.error("Error:", data.status, data.statusText);
    throw new Error("Error");
  }

  const response = await data.json();
  return response;
};

export const getInformationFromCountry = async (
  country: string
): Promise<CountryInfo[]> => {
  const API_KEY = Deno.env.get("API_KEY");
  if (!API_KEY) {
    throw new Error("API_KEY not found");
  }
  const url = "https://api.api-ninjas.com/v1/country?name=" + country;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (data.status !== 200) {
    console.error("Error:", data.status, data.statusText);
    throw new Error("Error");
  }

  const response = await data.json();
  return response;
};

export const getCapitalInfo = async (capital: string): Promise<CapitalInfo> => {
  const API_KEY = Deno.env.get("API_KEY");
  if (!API_KEY) {
    throw new Error("API_KEY not found");
  }

  const url = "https://api.api-ninjas.com/v1/worldtime?city=" + capital;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "X-Api-Key": API_KEY,
    },
  });
  if (data.status !== 200) {
    console.error("Error:", data.status, data.statusText);
    throw new Error("Error");
  }
  const response = await data.json();
  return response;
};
