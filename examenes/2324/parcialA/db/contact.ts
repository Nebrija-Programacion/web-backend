import mongoose from "npm:mongoose@8.0.0";
import { Contact } from "../types.ts";

const Schema = mongoose.Schema;

export type ContactModelType = mongoose.Document &
  Omit<Contact, "localTime" | "weather">;

const ContactSchema = new Schema({
  dni: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  cp: { type: String, required: true },
  isoCountryCode: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

export const ContactModel = mongoose.model<ContactModelType>(
  "Contact",
  ContactSchema
);
