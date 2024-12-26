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

    const { student, course, type, value, date } = await req.json();

    const newGrade = await Grade.create({
      student,
      course,
      type,
      value,
      date,
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
