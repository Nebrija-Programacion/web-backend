import mongoose from "mongoose";
import { Subject } from "../types.ts";
import { TeacherModel } from "./teacher.ts";
import { StudentModel } from "./student.ts";

const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    teacherID: { type: Schema.Types.ObjectId, required: true, ref: "Teacher" },
    studentsID: [
      { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    ],
  },
  { timestamps: true }
);

// validate studentsID
subjectSchema
  .path("studentsID")
  .validate(async function (studentsID: mongoose.Types.ObjectId[]) {
    try {
      if (studentsID.some((id) => !mongoose.isValidObjectId(id))) return false;

      const students = await StudentModel.find({ _id: { $in: studentsID } });
      return students.length === studentsID.length;
    } catch (e) {
      return false;
    }
  });

// validate teacherID
subjectSchema
  .path("teacherID")
  .validate(async function (teacherID: mongoose.Types.ObjectId) {
    try {
      if (!mongoose.isValidObjectId(teacherID)) return false;
      const teacher = await TeacherModel.findById(teacherID);
      if (!teacher) return false;
      return true;
    } catch (e) {
      return false;
    }
  });

export type SubjectModelType = mongoose.Document &
  Omit<Subject, "id" | "teacher" | "students"> & {
    teacherID: mongoose.Types.ObjectId;
    studentsID: Array<mongoose.Types.ObjectId>;
  };

export const SubjectModel = mongoose.model<SubjectModelType>(
  "Subject",
  subjectSchema
);
