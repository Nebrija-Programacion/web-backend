import mongoose from "npm:mongoose@7.6.3";
import { Person } from "../types.ts";

const Schema = mongoose.Schema;

const personSchema = new Schema(
  {
    name: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

export type PersonModelType = mongoose.Document & Omit<Person, "id">;

export default mongoose.model<PersonModelType>("Person", personSchema);
