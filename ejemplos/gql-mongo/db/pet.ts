import mongoose from "mongoose";
import { Pet } from "../types.ts";

const Schema = mongoose.Schema;

const PetSchema = new Schema({
  name: String,
  breed: String,
});

export type PetModelType = mongoose.Document & Omit<Pet, "id">;

export const PetModel = mongoose.model<PetModelType>("Pet", PetSchema);
