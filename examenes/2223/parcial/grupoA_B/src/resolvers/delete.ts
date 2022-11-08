import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { slotsCollection } from "../db/mongo.ts";
import { getQuery } from "oak/helpers.ts";

type RemoveSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeSlot = async (context: RemoveSlotContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.year || !params.month || !params.day || !params.hour) {
      context.response.status = 406;
      return;
    }
    const { year, month, day, hour } = params;
    const slot = await slotsCollection.findOne({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
    });
    if (!slot) {
      context.response.status = 404;
      return;
    }
    if (!slot.available) {
      context.response.status = 403;
      return;
    }

    await slotsCollection.deleteOne({ _id: slot._id });
    context.response.status = 200;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
