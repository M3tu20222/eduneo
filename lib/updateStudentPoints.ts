import StudentPoint from "@/models/StudentPoint";

export async function updateStudentPoints(
  studentId: string,
  courseId: string,
  points: number
) {
  let studentPoint = await StudentPoint.findOne({
    student: studentId,
    course: courseId,
  });

  if (!studentPoint) {
    studentPoint = new StudentPoint({
      student: studentId,
      course: courseId,
      points: 0,
    });
  }

  studentPoint.points += points;
  await studentPoint.save();

  return studentPoint;
}
