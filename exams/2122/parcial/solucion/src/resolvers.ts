import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

const checkDateValidity = (
  day: string,
  month: string,
  year: string
): boolean => {
  const date = new Date(`${month} ${day}, ${year}`);
  return date.toString() !== "Invalid Date";
};

export const status = async (req: Request, res: Response) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  res.status(200).send(`${day}-${month}-${year}`);
};

export const freeSeats = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("seats");

  if (!req.query) {
    return res.status(500).send("No params");
  }

  const { day, month, year } = req.query as {
    day: string;
    month: string;
    year: string;
  };

  if (!day || !month || !year) {
    return res.status(500).send("Missing day, month or year");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }

  const seats = await collection.find({ day, month, year }).toArray();

  const freeSeats = [];
  for (let i = 1; i <= 20; i++) {
    if (!seats.find((seat) => parseInt(seat.number) === i)) {
      freeSeats.push(i);
    }
  }
  return res.status(200).json({ free: freeSeats });
};

export const book = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("seats");
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const { day, month, year, number } = req.query as {
    day: string;
    month: string;
    year: string;
    number: string;
  };

  if (!day || !month || !year || !number) {
    return res.status(500).send("Missing day, month or year or seat number");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }

  const notFree = await collection.findOne({ day, month, year, number });
  if (notFree) {
    return res.status(500).send("Seat is not free");
  }

  const token = uuid();
  await collection.insertOne({ day, month, year, number, token });

  return res.status(200).json({ token });
};

export const free = async (req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const collection = db.collection("seats");
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const { day, month, year } = req.query as {
    day: string;
    month: string;
    year: string;
  };

  const token = req.headers.token;

  if (!day || !month || !year || !token) {
    return res
      .status(500)
      .send("Missing day, month or year or seat number or token");
  }

  if (!checkDateValidity(day, month, year)) {
    return res.status(500).send("Invalid day, month or year");
  }

  const booked = await collection.findOne({ day, month, year, token });
  if (booked) {
    await collection.deleteOne({ day, month, year, token });
    return res.status(200).send("Seat is now free");
  }

  return res.status(500).send("Seat is not booked");
};
