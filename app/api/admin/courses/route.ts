import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import Class from "@/models/Class";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const {
      name,
      code,
      description,
      branch,
      teacher,
      class: classId,
    } = await req.json();

    // Ders kodu benzersiz olmalı
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return NextResponse.json(
        { error: "Bu ders kodu zaten kullanımda" },
        { status: 400 }
      );
    }

    const newCourse = await Course.create({
      name,
      code,
      description,
      branch,
      teacher,
      class: classId,
    });

    // Dersi sınıfa ekle
    await Class.findByIdAndUpdate(classId, {
      $push: { courses: newCourse._id },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Ders ekleme hatası:", error);
    return NextResponse.json(
      { error: "Ders eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const courses = await Course.find()
      .populate("branch", "name")
      .populate("teacher", "name")
      .populate("class", "name");

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Dersleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Dersler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
