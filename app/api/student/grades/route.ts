import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Grade from "@/models/Grade";
import Course from "@/models/Course";
import User, { IUser } from "@/models/User";
import { Types, Document } from "mongoose";

interface ICourse {
  _id: Types.ObjectId;
  name: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
}

interface IGrade {
  _id: Types.ObjectId;
  course: ICourse;
  type: string;
  value: number;
  date: Date;
}

type IUserWithCourses = Omit<IUser, "courses"> & {
  courses: ICourse[];
} & Document;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;

    const student = (await User.findById(userId)
      .populate<{ courses: ICourse[] }>("courses")
      .lean()) as IUserWithCourses | null;
    if (!student) {
      return NextResponse.json(
        { error: "Öğrenci bulunamadı" },
        { status: 404 }
      );
    }

    const courseIds = student.courses.map((course: ICourse) => course._id);

    const grades = (await Grade.find({
      student: userId,
      course: { $in: courseIds },
    })
      .populate<{ course: ICourse }>({
        path: "course",
        select: "name teacher",
        populate: {
          path: "teacher",
          select: "firstName lastName",
        },
      })
      .sort("course")
      .lean()) as IGrade[];

    const formattedGrades = grades.reduce<Record<string, any>>((acc, grade) => {
      const courseId = grade.course._id.toString();
      if (!acc[courseId]) {
        acc[courseId] = {
          courseId: courseId,
          courseName: grade.course.name,
          teacherName: `${grade.course.teacher.firstName} ${grade.course.teacher.lastName}`,
          grades: [],
        };
      }
      acc[courseId].grades.push({
        _id: grade._id.toString(),
        type: grade.type,
        value: grade.value,
        date: grade.date.toISOString(),
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(formattedGrades));
  } catch (error) {
    console.error("Notlar alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Notlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
