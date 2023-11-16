import mongoose from "mongoose";
import { Teacher } from "../types.ts";

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export type TeacherModelType = mongoose.Document &
  Omit<Teacher, "id" | "subjects">;

export const TeacherModel = mongoose.model<TeacherModelType>(
  "Teacher",
  teacherSchema
);
