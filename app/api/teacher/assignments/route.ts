import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const {
      title,
      description,
      dueDate,
      course,
      class: classId,
      teacher,
    } = await req.json();

    const newAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      course,
      class: classId,
      teacher,
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("Ödev ekleme hatası:", error);
    return NextResponse.json(
      { error: "Ödev eklenirken bir hata oluştu" },
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

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si gerekli" },
        { status: 400 }
      );
    }

    const assignments = await Assignment.find({ teacher: userId })
      .populate("course", "name")
      .populate("class", "name")
      .lean();

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Ödevleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Ödevler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
