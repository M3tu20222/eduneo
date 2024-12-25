import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import Class from "@/models/Class";

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

    const courses = await Course.find({ teacher: userId }).distinct("class");
    const classes = await Class.find({ _id: { $in: courses } })
      .select("name academicYear students")
      .lean();

    const classesWithStudentCount = classes.map((cls) => ({
      _id: cls._id,
      name: cls.name,
      academicYear: cls.academicYear,
      studentCount: cls.students ? cls.students.length : 0,
    }));

    return NextResponse.json(classesWithStudentCount);
  } catch (error) {
    console.error("Öğretmen sınıfları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sınıflar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
