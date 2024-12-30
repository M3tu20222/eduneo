import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Grade from "@/models/Grade";
import Class from "@/models/Class";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const classId = req.nextUrl.searchParams.get("classId");
    const courseId = req.nextUrl.searchParams.get("courseId");
    if (!classId || !courseId) {
      return NextResponse.json(
        { error: "Sınıf ID ve Ders ID gerekli" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Sınıfı ve öğrencilerini bul
    const classData = (await Class.findById(classId)
      .populate({
        path: "students",
        select: "studentNumber firstName lastName",
        match: { role: "student" },
      })
      .lean()) as {
      _id: Types.ObjectId;
      name: string;
      students: Array<{
        _id: Types.ObjectId;
        studentNumber?: string;
        firstName: string;
        lastName: string;
      }>;
    } | null;

    if (!classData || !classData.students) {
      return NextResponse.json([]);
    }

    // Her öğrencinin notlarını bul
    const studentsWithGrades = await Promise.all(
      classData.students.map(async (student) => {
        const grades = await Grade.find({
          student: student._id,
          course: courseId,
        })
          .select("value type date")
          .sort({ date: -1 })
          .lean();

        return {
          id: student._id.toString(),
          number: student.studentNumber || "",
          name: `${student.firstName} ${student.lastName}`,
          class: classData.name,
          grades: grades.map((grade) => ({
            id: (grade._id as Types.ObjectId).toString(),
            value: grade.value,
            type: grade.type,
            date: grade.date,
          })),
        };
      })
    );

    return NextResponse.json(studentsWithGrades);
  } catch (error) {
    console.error("Öğrencileri getirme hatası:", error);
    return NextResponse.json(
      { error: "Öğrenciler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
