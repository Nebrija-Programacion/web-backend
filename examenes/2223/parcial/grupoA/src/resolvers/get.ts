import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";

type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const availableSlots = async (context: GetAvailabeSlotsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.year || !params.month) {
      context.response.status = 403;
      return;
    }

    const { year, month, day } = params;
    if (!day) {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          available: true,
        })
        .toArray();
      context.response.body = context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
    } else {
      const slots = await slotsCollection
        .find({
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          available: true,
        })
        .toArray();
      context.response.body = slots.map((slot) => {
        const { _id, ...rest } = slot;
        return rest;
      });
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
    const freeCars = await slotsCollection.find({ free: true }).toArray();
    if (freeCars.length > 0) {
      const slot = freeCars[0];
      const { _id, ...carWithoutId } = slot as SlotSchema;

      await slotsCollection.updateOne(
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
