import { Car, Booking } from "../types.ts";
import { ObjectId } from "mongo";

export type CarSchema = Omit<Car, "bookings"> & {
  _id: ObjectId;
};

export type BookingSchema = Omit<Booking, "car"> & {
  _id: ObjectId;
  car: string; //plate
};
