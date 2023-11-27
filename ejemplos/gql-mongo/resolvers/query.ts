import { GraphQLError } from "graphql";
import { PetModel } from "../db/pet.ts";
import { Pet } from "../types.ts";
import { petModelToPet } from "../controllers/petModelToPet.ts";

export const Query = {
  pets: async (): Promise<Pet[]> => {
    const pets = await PetModel.find().exec();
    return pets.map((pet) => petModelToPet(pet));
  },

  pet: async (_: unknown, args: { id: string }): Promise<Pet> => {
    const pet = await PetModel.findById(args.id);
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return petModelToPet(pet);
  },
};
