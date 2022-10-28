import { ObjectId } from "mongo";
import { Car } from "../types.ts";

export type CarSchema = Omit<Car, "id"> & {
  _id: ObjectId;
};
