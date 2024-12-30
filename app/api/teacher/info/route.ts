import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import { Types } from "mongoose";

interface TeacherDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  branches: Array<{ _id: Types.ObjectId; name: string }>;
}

interface CourseDocument {
  _id: Types.ObjectId;
  class: {
    _id: Types.ObjectId;
    name: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si gerekli" },
        { status: 400 }
      );
    }

    await dbConnect();

    const teacher = (await User.findById(userId)
      .select("name email branches")
      .populate("branches", "name")
      .lean()) as TeacherDocument;

    if (!teacher) {
      return NextResponse.json(
        { error: "Öğretmen bulunamadı" },
        { status: 404 }
      );
    }

    const courses = (await Course.find({ teacher: userId })
      .populate("class", "name")
      .lean()) as CourseDocument[];

    const classes = Array.from(
      new Set(courses.map((course) => course.class.name))
    );

    const teacherInfo = {
      name: teacher.name,
      email: teacher.email,
      branches: teacher.branches.map((branch) => branch.name),
      classes: classes,
    };

    return NextResponse.json(teacherInfo);
  } catch (error) {
    console.error("Öğretmen bilgileri getirme hatası:", error);
    return NextResponse.json(
      { error: "Öğretmen bilgileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
