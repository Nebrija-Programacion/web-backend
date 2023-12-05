import { PersonModelType } from "../db/person.ts";
import { PetModel, PetModelType } from "../db/pet.ts";

export const Person = {
  pets: async (parent: PersonModelType): Promise<PetModelType[]> => {
    const pets = await PetModel.find({ owner: parent._id });
    return pets;
  },
};
