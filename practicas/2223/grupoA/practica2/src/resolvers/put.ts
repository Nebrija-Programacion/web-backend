import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { carsCollection } from "../db/mongo.ts";
import { CarSchema } from "../db/schemas.ts";

type PutReleaseCarContext = RouterContext<
  "/releaseCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type PutAskCarContext = RouterContext<
  "/askCar",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putAskCar = async (context: PutAskCarContext) => {
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

export const putReleaseCar = async (context: PutReleaseCarContext) => {
  try {
    if (context.params?.id) {
      const car: CarSchema | undefined = await carsCollection.findOne({
        _id: new ObjectId(context.params.id),
      });

      if (car) {
        if (!car.free) {
          await carsCollection.updateOne(
            {
              _id: car._id,
            },
            {
              $set: {
                free: true,
              },
            }
          );
          context.response.status = 200;
          return;
        } else {
          context.response.status = 400;
          context.response.body = { message: "Car is already free" };
        }
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
