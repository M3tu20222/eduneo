import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Grade from "@/models/Grade";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { studentId, classId, courseId, value, type } = await req.json();

    if (!studentId || !classId || !courseId || !value || !type) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const newGrade = await Grade.create({
      student: studentId,
      class: classId,
      course: courseId,
      value,
      type,
      date: new Date(),
    });

    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    console.error("Not ekleme hatası:", error);
    return NextResponse.json(
      { error: "Not eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const classId = req.nextUrl.searchParams.get("classId");
    if (!classId) {
      return NextResponse.json(
        { error: "Sınıf ID'si gerekli" },
        { status: 400 }
      );
    }

    const grades = await Grade.find({ class: classId })
      .populate("student", "name number")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(grades);
  } catch (error) {
    console.error("Notları getirme hatası:", error);
    return NextResponse.json(
      { error: "Notlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
