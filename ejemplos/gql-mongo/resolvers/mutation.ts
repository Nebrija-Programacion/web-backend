import { GraphQLError } from "graphql";
import { PetModel } from "../db/pet.ts";
import { Pet } from "../types.ts";
import { petModelToPet } from "../controllers/petModelToPet.ts";

export const Mutation = {
  addPet: async (
    _: unknown,
    args: { name: string; breed: string }
  ): Promise<Pet> => {
    const pet = {
      name: args.name,
      breed: args.breed,
    };
    const newPet = await PetModel.create(pet);
    return petModelToPet(newPet);
  },
  deletePet: async (_: unknown, args: { id: string }): Promise<Pet> => {
    const pet = await PetModel.findByIdAndDelete(args.id);
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return petModelToPet(pet);
  },
  updatePet: async (
    _: unknown,
    args: { id: string; name: string; breed: string }
  ): Promise<Pet> => {
    const pet = await PetModel.findByIdAndUpdate(
      args.id,
      { name: args.name, breed: args.breed },
      { new: true }
    );
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return petModelToPet(pet);
  },
};
