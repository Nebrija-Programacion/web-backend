import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { carsCollection } from "../db/mongo.ts";

type DeleteBookContext = RouterContext<
  "/removeCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeCar = async (context: DeleteBookContext) => {
  try {
    if (context.params?.id) {
      const car = await carsCollection.findOne({
        _id: new ObjectId(context.params.id),
      });
      if (car) {
        if (car.free) {
          await carsCollection.deleteOne({
            _id: new ObjectId(context.params.id),
          });
          context.response.status = 200;
        } else {
          context.response.status = 400;
          context.response.body = { message: "Car is not free" };
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
