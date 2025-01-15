import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SendMessageForm from "@/components/student/SendMessageForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import Course, { ICourse } from "@/models/Course";
import { Types } from "mongoose";

interface Teacher {
  id: string;
  name: string;
}

async function getTeachers(userId: string): Promise<Teacher[]> {
  await dbConnect();

  const student = await User.findById(userId).populate<{ courses: ICourse[] }>(
    "courses"
  );
  if (!student) {
    throw new Error("Öğrenci bulunamadı");
  }

  // Explicitly type student as IUser & { courses: ICourse[] }
  const typedStudent = student as IUser & { courses: ICourse[] };

  const courseIds = typedStudent.courses.map((course) => course._id);
  const courses = await Course.find({ _id: { $in: courseIds } }).populate<{
    teacher: IUser;
  }>("teacher");

  const teacherSet = new Set<string>();
  courses.forEach((course) => {
    if (course.teacher) {
      teacherSet.add(
        JSON.stringify({
          id: course.teacher._id.toString(),
          name: `${course.teacher.firstName} ${course.teacher.lastName}`,
        })
      );
    }
  });

  return Array.from(teacherSet).map((teacher) => JSON.parse(teacher));
}

export default async function SendMessagePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  const teachers = await getTeachers(session.user.id);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Öğretmene Mesaj Gönder</CardTitle>
        </CardHeader>
        <CardContent>
          <SendMessageForm teachers={teachers} />
        </CardContent>
      </Card>
    </div>
  );
}
