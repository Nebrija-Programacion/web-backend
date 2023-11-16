// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { Subject } from "../types.ts";
import { SubjectModel, SubjectModelType } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const putSubject = async (
  req: Request<{ id: string }, {}, SubjectModelType>,
  res: Response<Subject | { error: unknown }>
) => {
  const id = req.params.id;
  const { name, year, teacherID, studentsID } = req.body;
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      id,
      { name, year, teacherID, studentsID },
      { new: true, runValidators: true }
    );

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
