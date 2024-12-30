import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { Types } from "mongoose";

interface CourseQuery {
  teacher: string;
  class?: string;
}

interface CourseDocument {
  _id: Types.ObjectId;
  name: string;
  code: string;
  branch: {
    _id: Types.ObjectId;
    name: string;
  };
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
    const classId = req.nextUrl.searchParams.get("classId");

    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      );
    }

    await dbConnect();

    let query: CourseQuery = { teacher: userId };
    if (classId) {
      query = { ...query, class: classId };
    }

    const courses = (await Course.find(query)
      .populate("branch", "name")
      .populate("class", "name")
      .lean()) as CourseDocument[];

    const formattedCourses = courses.map((course) => ({
      id: course._id.toString(),
      name: course.name,
      code: course.code,
      branch: course.branch,
      class: course.class,
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Öğretmen derslerini getirme hatası:", error);
    return NextResponse.json(
      { error: "Dersler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
