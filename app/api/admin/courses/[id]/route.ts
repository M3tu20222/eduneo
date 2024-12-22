import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import Class from "@/models/Class";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const course = await Course.findById(params.id)
      .populate("branch", "name")
      .populate("teacher", "firstName lastName")
      .populate("class", "name");

    if (!course) {
      return NextResponse.json({ error: "Ders bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Ders getirme hatası:", error);
    return NextResponse.json(
      { error: "Ders alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Ders kodu benzersiz olmalı (mevcut ders hariç)
    const existingCourse = await Course.findOne({
      code,
      _id: { $ne: params.id },
    });
    if (existingCourse) {
      return NextResponse.json(
        { error: "Bu ders kodu zaten kullanımda" },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      params.id,
      { name, code, description, branch, teacher, class: classId },
      { new: true, runValidators: true }
    )
      .populate("branch", "name")
      .populate("teacher", "firstName lastName")
      .populate("class", "name");

    if (!updatedCourse) {
      return NextResponse.json({ error: "Ders bulunamadı" }, { status: 404 });
    }

    // Eski sınıftan dersi kaldır
    await Class.updateMany(
      { courses: params.id, _id: { $ne: classId } },
      { $pull: { courses: params.id } }
    );

    // Yeni sınıfa dersi ekle
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { courses: params.id },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Ders güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Ders güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
