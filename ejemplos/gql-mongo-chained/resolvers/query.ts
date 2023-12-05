import { GraphQLError } from "graphql";
import { PetModel, PetModelType } from "../db/pet.ts";
import { PersonModel, PersonModelType } from "../db/person.ts";

export const Query = {
  pets: async (): Promise<PetModelType[]> => {
    const pets = await PetModel.find().exec();
    return pets;
  },

  pet: async (_: unknown, args: { id: string }): Promise<PetModelType> => {
    const pet = await PetModel.findById(args.id);
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return pet;
  },

  persons: async (): Promise<PersonModelType[]> => {
    const persons = await PersonModel.find().exec();
    return persons;
  },

  person: async (
    _: unknown,
    args: { id: string }
  ): Promise<PersonModelType> => {
    const person = await PersonModel.findById(args.id);
    if (!person) {
      throw new GraphQLError(`No person found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return person;
  },
};
