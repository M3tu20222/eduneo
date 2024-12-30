import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Class from "@/models/Class";
import Course from "@/models/Course";
import { Types } from "mongoose";

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

    // Önce öğretmenin verdiği dersleri bul
    const teacherCourses = await Course.find({ teacher: userId })
      .distinct("class")
      .lean();

    if (!teacherCourses || teacherCourses.length === 0) {
      return NextResponse.json([]);
    }

    // Sonra bu derslerin olduğu sınıfları getir
    const classes = await Class.find({
      _id: { $in: teacherCourses },
      isActive: true,
    })
      .select("_id name academicYear")
      .lean();

    const formattedClasses = classes.map((cls) => ({
      id: (cls._id as Types.ObjectId).toString(),
      name: cls.name,
      academicYear: cls.academicYear,
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error("Öğretmen sınıfları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sınıflar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
