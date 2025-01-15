import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Grade from "@/models/Grade";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si gerekli" },
        { status: 400 }
      );
    }

    const grades = await Grade.find({ student: userId })
      .populate("course", "name")
      .lean();

    const formattedGrades = grades.map((grade) => ({
      course: grade.course.name,
      grade: grade.grade,
    }));

    return NextResponse.json(formattedGrades);
  } catch (error) {
    console.error("Notlar alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Notlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
