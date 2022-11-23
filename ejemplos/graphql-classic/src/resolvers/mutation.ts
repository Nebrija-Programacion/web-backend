import { ObjectId } from "mongo";
import { carsCollection } from "../db/dbconnection.ts";
import { Car } from "../types.ts";

export const Mutation = {
  createCar: async (
    _: unknown,
    args: { plate: string; brand: string; seats: number }
  ): Promise<Car> => {
    try {
      const exists = await carsCollection.findOne({ plate: args.plate });
      if (exists) {
        throw new Error("Car already exists");
      }

      const car = await carsCollection.insertOne({
        plate: args.plate,
        brand: args.brand,
        seats: args.seats,
      });
      return {
        id: car.toString(),
        plate: args.plate,
        brand: args.brand,
        seats: args.seats,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  updateCar: async (
    _: unknown,
    args: { id: string; plate: string; brand: string; seats: number }
  ): Promise<Car> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (!car) {
        throw new Error("Car not found");
      }

      const updatedCar = await carsCollection.updateOne(
        { _id: new ObjectId(args.id) },
        {
          $set: {
            plate: args.plate,
            brand: args.brand,
            seats: args.seats,
          },
        }
      );
      return {
        id: updatedCar.upsertedId!.toString(),
        plate: args.plate,
        brand: args.brand,
        seats: args.seats,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  deleteCar: async (_: unknown, args: { id: string }): Promise<Car> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (!car) {
        throw new Error("Car not found");
      }

      const deletedCar = await carsCollection.deleteOne({
        _id: new ObjectId(args.id),
      });
      return { ...car, id: car._id.toString() };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
