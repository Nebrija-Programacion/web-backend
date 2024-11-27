import { Dinosaur, DinosaurModel } from "./types.ts";

export const formModelToDinosaur = (dinosaurModel: DinosaurModel): Dinosaur => {
  return {
    id: dinosaurModel._id!.toString(),
    name: dinosaurModel.name,
    type: dinosaurModel.type,
  };
};
