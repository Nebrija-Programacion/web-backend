import { PetModelType } from "../db/pet.ts";
import { Pet } from "../types.ts";

export const petModelToPet = (petModel: PetModelType): Pet => {
  return {
    id: petModel._id.toString(),
    name: petModel.name,
    breed: petModel.breed,
  };
};
