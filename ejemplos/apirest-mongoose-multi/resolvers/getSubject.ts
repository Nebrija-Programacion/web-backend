// @deno-types="npm:@types/express@4"
import { Request, Response, request } from "express";
import { Subject } from "../types.ts";

import { SubjectModel } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const getSubject = async (
  req: Request<{ id: string }>,
  res: Response<Subject | { error: unknown }>
) => {
  const id = req.params.id;
  try {
    const subject = await SubjectModel.findById(id).exec();
    if (!subject) {
      res.status(404).send({ error: "Subject not found" });
      return;
    }
    const subjectResponse: Subject = await getSubjectFromModel(subject);
    res.status(200).json(subjectResponse).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
