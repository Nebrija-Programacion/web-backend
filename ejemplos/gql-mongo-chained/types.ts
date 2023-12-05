export type Pet = {
  id: string;
  name: string;
  breed: string;
  owner: Person;
};

export type Person = {
  id: string;
  name: string;
  age: number;
  pets: Pet[];
};
