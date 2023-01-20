import { CharacterAPIRest, LocationAPIRest } from "../types.ts";

export const Location = {
  residents: async (
    parent: LocationAPIRest
  ): Promise<Array<CharacterAPIRest>> => {
    const residents = await Promise.all(
      parent.residents.map(async (resident) => {
        const res = await fetch(resident);
        return res.json();
      })
    );
    return residents;
  },
};
