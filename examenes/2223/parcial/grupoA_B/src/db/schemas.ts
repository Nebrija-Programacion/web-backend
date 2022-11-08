import { ObjectId } from "mongo";
import { Slot } from "../types.ts";

export type SlotSchema = Slot & {
  _id: ObjectId;
};
