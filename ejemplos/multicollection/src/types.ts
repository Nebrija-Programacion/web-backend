export type Booking = {
  id: string;
  dni: string;
  car: Car;
  date: Date;
};

export type Car = {
  brand: string;
  plate: string;
  seats: number;
  bookings: Booking[];
};
