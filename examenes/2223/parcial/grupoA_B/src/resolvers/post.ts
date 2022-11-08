import { RouterContext } from "oak/router.ts";
import { SlotSchema } from "../db/schemas.ts";
import { Slot } from "../types.ts";
import { slotsCollection } from "../db/mongo.ts";

type PostAddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

// months are 0-indexed, so 0 is January, 1 is February, etc.
const isValidDate = (
  year: number,
  month: number,
  day: number,
  hour: number
): boolean => {
  const date = new Date(year, month, day, hour);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day &&
    date.getHours() === hour
  );
};

export const addSlot = async (context: PostAddSlotContext): Promise<void> => {
  try {
    const result = context.request.body({ type: "json" });
    const value: Slot = await result.value;
    if (!value?.day || !value?.month || !value?.year || !value?.hour) {
      context.response.status = 406;
      return;
    }

    const { day, month, year, hour } = value;

    // check if date is valid
    if (!isValidDate(year, month - 1, day, hour)) {
      context.response.status = 406;
      return;
    }

    // check if slot is already booked
    const foundSlot = await slotsCollection.findOne({ day, month, year, hour });
    if (foundSlot) {
      if (!foundSlot.available) {
        context.response.status = 409;
        return;
      } else {
        context.response.status = 200;
        return;
      }
    }

    const slot: Partial<Slot> = {
      ...value,
      available: true,
    };

    await slotsCollection.insertOne(slot as SlotSchema);
    const { _id, ...slotWithoutId } = slot as SlotSchema;
    context.response.body = slotWithoutId;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
