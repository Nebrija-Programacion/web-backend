import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { carsCollection } from "../db/mongo.ts";
import { CarSchema } from "../db/schemas.ts";

type GetCarContext = RouterContext<
  "/car/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCar = async (context: GetCarContext) => {
  try {
    if (context.params?.id) {
      const car: CarSchema | undefined = await carsCollection.findOne({
        _id: new ObjectId(context.params.id),
      });

      if (car) {
        const { _id, ...carWithoutId } = car as CarSchema;

        context.response.body = {
          ...carWithoutId,
          id: _id.toString(),
        };
      } else {
        context.response.status = 404;
        context.response.body = { message: "Car not found" };
      }
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};

type GetAskCarContext = RouterContext<
  "/askCar",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getAskCar = async (context: GetAskCarContext) => {
  try {
    const freeCars = await carsCollection.find({ free: true }).toArray();
    if (freeCars.length > 0) {
      const car = freeCars[0];
      const { _id, ...carWithoutId } = car as CarSchema;

      await carsCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            free: false,
          },
        }
      );

      context.response.body = {
        ...carWithoutId,
        id: _id.toString(),
      };
    } else {
      context.response.status = 404;
      context.response.body = { message: "No free cars" };
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
