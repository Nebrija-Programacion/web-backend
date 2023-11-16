import { SubjectModelType } from "../db/subject.ts";
import { StudentModel } from "../db/student.ts";
import { TeacherModel } from "../db/teacher.ts";
import { Subject } from "../types.ts";

export const getSubjectFromModel = async (
  subject: SubjectModelType
): Promise<Subject> => {
  const { _id, name, year, teacherID, studentsID } = subject;

  const teacher = await TeacherModel.findById(teacherID);
  if (!teacher) throw new Error("Teacher not found");

  const students = await StudentModel.find({ _id: { $in: studentsID } });

  return {
    id: _id.toString(),
    name,
    year,
    teacher: {
      id: teacher._id.toString(),
      name: teacher.name,
      email: teacher.email,
    },
    students: students.map((student) => ({
      id: student._id.toString(),
      name: student.name,
      email: student.email,
    })),
  };
};
