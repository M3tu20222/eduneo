import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import StudentPoint from "@/models/StudentPoint";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { studentId, courseId, change } = await req.json();

    let studentPoint = await StudentPoint.findOne({
      student: studentId,
      course: courseId,
    });

    if (!studentPoint) {
      studentPoint = new StudentPoint({
        student: studentId,
        course: courseId,
        points: 0,
      });
    }

    studentPoint.points += change;
    await studentPoint.save();

    return NextResponse.json(studentPoint);
  } catch (error) {
    console.error("Puan güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Puan güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
