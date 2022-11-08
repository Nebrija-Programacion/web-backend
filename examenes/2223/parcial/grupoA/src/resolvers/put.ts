import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";

type PutBookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const bookSlot = async (context: PutBookSlotContext) => {
  try {
    const value = await context.request.body().value;
    if (
      !value.year ||
      !value.month ||
      !value.day ||
      !value.hour ||
      !value.dni
    ) {
      context.response.status = 406;
      return;
    }
    const { year, month, day, hour, dni } = value;
    const slot = await slotsCollection.findOne({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      available: true,
    });
    if (!slot) {
      context.response.status = 404;
      return;
    }
    await slotsCollection.updateOne(
      { _id: slot._id },
      { $set: { available: false, dni } }
    );
    context.response.status = 200;
    const { _id, ...rest } = slot;
    context.response.body = { ...rest, available: false, dni };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
