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

type GetDoctorAppointmentsContext = RouterContext<
  "/doctorAppointments/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetPatientAppointmentsContext = RouterContext<
  "/patientAppointments/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
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

export const doctorAppointments = async (
  context: GetDoctorAppointmentsContext
) => {
  try {
    const { id } = context.params;

    // get current day, month and year
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // get all slots posterior the current day, month and year
    const slots = await slotsCollection

      .find({
        doctor_id: id,
        $or: [
          {
            year,
            month,
            day: { $gte: day },
          },
          {
            year,
            month: { $gte: month },
          },
          {
            year: { $gte: year },
          },
        ],
      })
      .toArray();

    context.response.body = context.response.body = slots.map((slot) => {
      const { _id, ...rest } = slot;
      return rest;
    });
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};

export const patientAppointments = async (
  context: GetPatientAppointmentsContext
) => {
  try {
    const { id } = context.params;

    // get current day, month and year
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // get all slots posterior the current day, month and year
    const slots = await slotsCollection

      .find({
        dni: id,
        $or: [
          {
            year,
            month,
            day: { $gte: day },
          },
          {
            year,
            month: { $gte: month },
          },
          {
            year: { $gte: year },
          },
        ],
      })
      .toArray();

    context.response.body = context.response.body = slots.map((slot) => {
      const { _id, ...rest } = slot;
      return rest;
    });
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
