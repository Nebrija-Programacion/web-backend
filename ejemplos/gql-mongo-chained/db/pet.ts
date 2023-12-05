import mongoose from "mongoose";
import { Pet } from "../types.ts";

const Schema = mongoose.Schema;

const PetSchema = new Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: "Person" },
});

export type PetModelType = mongoose.Document &
  Omit<Pet, "id" | "ownder"> & { owner: mongoose.Types.ObjectId };

// validate if owner exists
PetSchema.path("owner").validate(async function (
  value: mongoose.Types.ObjectId
) {
  // check if owner has changed
  if (value === this.owner) {
    return true;
  }

  const owner = await mongoose.models.Person.findById(value);
  if (!owner) {
    throw new Error(`Owner with id ${value} does not exist`);
  }
  return true;
});

export const PetModel = mongoose.model<PetModelType>("Pet", PetSchema);
