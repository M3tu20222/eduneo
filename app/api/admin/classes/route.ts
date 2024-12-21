import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Class from "@/models/Class";
import User from "@/models/User";

// Sınıfları listele
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const classes = await Class.find()
      .populate("classTeacher", "firstName lastName")
      .lean();

    console.log("Fetched classes:", JSON.stringify(classes, null, 2));

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Sınıfları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sınıflar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}


// Yeni sınıf ekle
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();

    // Sınıf öğretmeninin varlığını ve rolünü kontrol et
    const classTeacher = await User.findById(body.classTeacher);
    if (!classTeacher || classTeacher.role !== "teacher") {
      return NextResponse.json(
        { error: "Geçersiz sınıf öğretmeni" },
        { status: 400 }
      );
    }

    // Branş öğretmenlerinin varlığını ve rollerini kontrol et
    if (body.branchTeachers && body.branchTeachers.length > 0) {
      for (const branchTeacher of body.branchTeachers) {
        const teacher = await User.findById(branchTeacher.teacher);
        if (!teacher || teacher.role !== "teacher") {
          return NextResponse.json(
            { error: "Geçersiz branş öğretmeni" },
            { status: 400 }
          );
        }
      }
    }

    // Öğrencilerin varlığını ve rollerini kontrol et
    if (body.students && body.students.length > 0) {
      for (const studentId of body.students) {
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
          return NextResponse.json(
            { error: "Geçersiz öğrenci" },
            { status: 400 }
          );
        }
      }
    }

    const newClass = await Class.create(body);

    // Detaylı sınıf bilgilerini döndür
    const populatedClass = await Class.findById(newClass._id)
      .populate("classTeacher", "firstName lastName email")
      .populate("students", "firstName lastName email")
      .populate("branchTeachers.teacher", "firstName lastName email");

    return NextResponse.json(populatedClass, { status: 201 });
  } catch (error: any) {
    console.error("Sınıf eklerken hata:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu sınıf adı ve akademik yıl kombinasyonu zaten mevcut" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Sınıf eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
