import mongoose from "mongoose";
import { Student } from "../types.ts";

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export type StudentModelType = mongoose.Document &
  Omit<Student, "id" | "subjects">;

export const StudentModel = mongoose.model<StudentModelType>(
  "Student",
  studentSchema
);
