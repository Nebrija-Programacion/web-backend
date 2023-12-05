import { GraphQLError } from "graphql";
import { PetModel, PetModelType } from "../db/pet.ts";
import { PersonModel, PersonModelType } from "../db/person.ts";
import mongoose from "mongoose";

export const Mutation = {
  addPet: async (
    _: unknown,
    args: { name: string; breed: string; owner: string }
  ): Promise<PetModelType> => {
    const pet = {
      name: args.name,
      breed: args.breed,
      owner: new mongoose.Types.ObjectId(args.owner),
    };
    const newPet = await PetModel.create(pet);
    return newPet;
  },
  deletePet: async (
    _: unknown,
    args: { id: string }
  ): Promise<PetModelType> => {
    const pet = await PetModel.findByIdAndDelete(args.id);
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return pet;
  },
  updatePet: async (
    _: unknown,
    args: { id: string; name: string; breed: string; owner: string }
  ): Promise<PetModelType> => {
    const pet = await PetModel.findByIdAndUpdate(
      args.id,
      { name: args.name, breed: args.breed, owner: args.owner },
      { new: true, runValidators: true }
    );
    if (!pet) {
      throw new GraphQLError(`No pet found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return pet;
  },

  addPerson: async (
    _: unknown,
    args: { name: string; age: number }
  ): Promise<PersonModelType> => {
    const person = {
      name: args.name,
      age: args.age,
    };
    const newPerson = await PersonModel.create(person);
    return newPerson;
  },

  deletePerson: async (
    _: unknown,
    args: { id: string }
  ): Promise<PersonModelType> => {
    const person = await PersonModel.findByIdAndDelete(args.id);
    if (!person) {
      throw new GraphQLError(`No person found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return person;
  },

  updatePerson: async (
    _: unknown,
    args: { id: string; name: string; age: number }
  ): Promise<PersonModelType> => {
    const person = await PersonModel.findByIdAndUpdate(
      args.id,
      { name: args.name, age: args.age },
      { new: true, runValidators: true }
    );
    if (!person) {
      throw new GraphQLError(`No person found with id ${args.id}`, {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return person;
  },
};
