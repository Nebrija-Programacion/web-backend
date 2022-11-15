import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { bookingsCollection, carsCollection } from "../db/dbconnection.ts";
import { BookingSchema, CarSchema } from "../db/schema.ts";

type GetBookingsContext = RouterContext<
  "/bookings",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetCarsContext = RouterContext<
  "/cars",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCars = async (context: GetCarsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    const carsDB: CarSchema[] = await carsCollection
      .find({ ...params })
      .toArray();
    const cars = await Promise.all(
      carsDB.map(async (car) => ({
        ...car,
        bookings: await bookingsCollection.find({ car: car.plate }).toArray(),
      }))
    );
    context.response.body = cars;
  } catch (error) {
    context.response.status = 500;
    context.response.body = { message: error.message };
  }
};

export const getBookings = async (context: GetBookingsContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    const { date } = params;

    const query = date ? { date: { $eq: new Date(date) } } : {};
    const bookingsDB: BookingSchema[] = await bookingsCollection
      .find(query)
      .toArray();

    const bookings = await Promise.all(
      bookingsDB.map(async (booking) => {
        const plate = booking.car;
        const car: CarSchema | undefined = await carsCollection.findOne({
          plate,
        });
        if (!car) throw new Error("Booking Error. Car not found");
        return {
          id: booking._id.toString(),
          dni: booking.dni,
          date: booking.date,
          car: {
            brand: car.brand,
            plate: car.plate,
            seats: car.seats,
          },
        };
      })
    );

    context.response.body = bookings;
  } catch (error) {
    context.response.status = 500;
    context.response.body = { message: error.message };
  }
};
