export type Location = {
  country: string;
  city: string;
  zipcode: string;
};

export type Weather = {
  location: Location;
  temperature: number;
  description: string;
};
