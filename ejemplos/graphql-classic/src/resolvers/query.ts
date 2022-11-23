import { carsCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Car } from "../types.ts";

export const Query = {
  getCars: async (): Promise<Car[]> => {
    try {
      const cars = await carsCollection.find().toArray();
      return cars.map((car) => ({ ...car, id: car._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getCar: async (_: unknown, args: { id: string }): Promise<Car | null> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (car) return { ...car, id: car._id.toString() };
      else return null;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
