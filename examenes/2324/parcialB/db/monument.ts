import mongoose from "npm:mongoose@8.0.0";
import { Monument } from "../types.ts";

const Schema = mongoose.Schema;

export type MonumentModelType = mongoose.Document &
  Omit<Monument, "id" | "localTime" | "weather">;

const MonumentSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cp: { type: String, required: true },
  isoCountryCode: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

export const MonumentModel = mongoose.model<MonumentModelType>(
  "Monument",
  MonumentSchema
);
