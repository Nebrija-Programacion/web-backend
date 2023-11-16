// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject } from "../types.ts";

import { SubjectModel } from "../db/subject.ts";
import { getSubjectFromModel } from "../controllers/getSubjectFromModel.ts";

export const getSubjects = async (
  req: Request,
  res: Response<Subject[] | { error: unknown }>
) => {
  try {
    const subjects = await SubjectModel.find({}).exec();
    const subjectsResponse: Subject[] = await Promise.all(
      subjects.map((subject) => getSubjectFromModel(subject))
    );
    res.status(200).json(subjectsResponse).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
