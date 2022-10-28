import { RouterContext } from "oak/router.ts";
import { CarSchema } from "../db/schemas.ts";
import { Car } from "../types.ts";
import { carsCollection } from "../db/mongo.ts";

type PostBooksContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAddCar = async (context: PostBooksContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.plate || !value?.seats) {
      context.response.status = 400;
      return;
    }
    const car: Partial<Car> = {
      ...value,
      free: true,
    };

    //check if car already in db
    const found = await carsCollection.findOne({ plate: value.plate });
    if (found) {
      context.response.status = 400;
      context.response.body = { message: "Car already in db" };
    }

    const id = await carsCollection.insertOne(car as CarSchema);
    car.id = id.toString();
    const { _id, ...carWithoutId } = car as CarSchema;
    context.response.body = carWithoutId;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
