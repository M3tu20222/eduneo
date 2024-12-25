import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
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

    const courses = await Course.find({ teacher: userId })
      .populate("branch", "name")
      .populate("class", "name")
      .lean();

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Öğretmen dersleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Dersler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
