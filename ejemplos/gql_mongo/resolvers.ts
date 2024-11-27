import { Collection, ObjectId } from "mongodb";
import { Dinosaur, DinosaurModel } from "./types.ts";
import { formModelToDinosaur } from "./utils.ts";

export const resolvers = {
  Query: {
    dinosaurs: async (
      _: unknown,
      __: unknown,
      context: { DinosaursCollection: Collection<DinosaurModel> },
    ): Promise<Dinosaur[]> => {
      const dinosaursModel = await context.DinosaursCollection.find().toArray();
      return dinosaursModel.map((dinosaurModel) =>
        formModelToDinosaur(dinosaurModel)
      );
    },
    dinosaur: async (
      _: unknown,
      { id }: { id: string },
      context: {
        DinosaursCollection: Collection<DinosaurModel>;
      },
    ): Promise<Dinosaur | null> => {
      const dinosaurModel = await context.DinosaursCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!dinosaurModel) {
        return null;
      }
      return formModelToDinosaur(dinosaurModel);
    },
  },
  Mutation: {
    addDinosaur: async (
      _: unknown,
      args: { name: string; type: string },
      context: {
        DinosaursCollection: Collection<DinosaurModel>;
      },
    ): Promise<Dinosaur> => {
      const { name, type } = args;
      const { insertedId } = await context.DinosaursCollection.insertOne({
        name,
        type,
      });
      const dinosaurModel = {
        _id: insertedId,
        name,
        type,
      };
      return formModelToDinosaur(dinosaurModel!);
    },
    deleteDinosaur: async (
      _: unknown,
      args: { id: string },
      context: {
        DinosaursCollection: Collection<DinosaurModel>;
      },
    ): Promise<Dinosaur | null> => {
      const id = args.id;
      const dinosaurModel = await context.DinosaursCollection.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!dinosaurModel) {
        return null;
      }
      return formModelToDinosaur(dinosaurModel);
    },
  },
};
