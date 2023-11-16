// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { SubjectModel, SubjectModelType } from "../db/subject.ts";

export const deleteSubject = async (
  req: Request<{ id: string }, {}>,
  res: Response<string | { error: unknown }>
) => {
  const id = req.params.id;
  const subject = await SubjectModel.findByIdAndDelete(id).exec();
  if (!subject) {
    res.status(404).send({ error: "Subject not found" });
    return;
  }
  res.status(200).send("Subject deleted");
};
