import mongoose from "mongoose";
import { Contact } from "../types.ts";
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  country: { type: String, required: true },
  capital: { type: String, required: true },
});

export type ContactModelType =
  & mongoose.Document
  & Omit<Contact, "id" | "time">
  & {
    capital: string;
  };

export const ContactModel = mongoose.model<ContactModelType>(
  "Contact",
  ContactSchema,
);
