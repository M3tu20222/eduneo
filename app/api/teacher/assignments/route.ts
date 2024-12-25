import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";
import Course from "@/models/Course";

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

    const teacherCourses = await Course.find({ teacher: userId }).select("_id");
    const courseIds = teacherCourses.map((course) => course._id);

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate("course", "name")
      .populate("class", "name")
      .lean();

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Öğretmen ödevleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Ödevler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
