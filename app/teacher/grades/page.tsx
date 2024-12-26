import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { GradeEntryForm } from "@/components/teacher/GradeEntryForm";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import User from "@/models/User";
import { Types } from "mongoose";

interface CourseDocument {
  _id: Types.ObjectId;
  name: string;
}

interface StudentDocument {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
}

async function getCourses(teacherId: string) {
  await dbConnect();
  const courses = await Course.find({ teacher: teacherId })
    .select("_id name")
    .lean();
  return courses.map((course) => ({
    _id: (course._id as Types.ObjectId).toString(),
    name: course.name,
  }));
}

async function getStudents() {
  await dbConnect();
  const students = await User.find({ role: "student" })
    .select("_id firstName lastName")
    .lean();
  return students.map((student) => ({
    _id: (student._id as Types.ObjectId).toString(),
    name: `${student.firstName} ${student.lastName}`,
  }));
}

export default async function TeacherGradesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "teacher") {
    redirect("/login");
  }

  const courses = await getCourses(session.user.id);
  const students = await getStudents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Not Girişi</h1>
      <GradeEntryForm courses={courses} students={students} />
    </div>
  );
}
