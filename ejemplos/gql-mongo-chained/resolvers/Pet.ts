import { GraphQLError } from "graphql";
import { PersonModel, PersonModelType } from "../db/person.ts";
import { PetModelType } from "../db/pet.ts";

export const Pet = {
  owner: async (parent: PetModelType): Promise<PersonModelType> => {
    const person = await PersonModel.findById(parent.owner).exec();
    if (!person) {
      throw new GraphQLError(`No person found with id ${parent.owner}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return person;
  },
};
