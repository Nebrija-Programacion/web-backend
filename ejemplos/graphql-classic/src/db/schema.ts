import { Car } from "../types.ts";
import { ObjectId } from "mongo";

export type CarSchema = Omit<Car, "id"> & {
  _id: ObjectId;
};
