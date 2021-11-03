import { Request, Response } from "express";
import { Db } from "mongodb";

export const characters = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const db: Db = req.app.get("db");
  const chars = await db
    .collection("Characters")
    .find()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .toArray();
  res.status(200).json(chars);
};

export const character = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db: Db = req.app.get("db");
  const char = await db.collection("Characters").findOne({ id: parseInt(id) });
  if (char) res.status(200).json(char);
  else res.status(404).send();
};
