// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject } from "../types.ts";

import { SubjectModel, SubjectModelType } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const postSubject = async (
  req: Request<{}, {}, SubjectModelType>,
  res: Response<Subject | { error: unknown }>
) => {
  try {
    const { name, teacherID, studentsID, year } = req.body;
    const subject = new SubjectModel({
      name,
      year,
      teacherID,
      studentsID,
    });
    await subject.save();

    const subjectResponse: Subject = await getSubjectFromModel(subject);

    res.status(201).json(subjectResponse).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
