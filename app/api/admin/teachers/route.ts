import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Branch from "@/models/Branch";
import Class from "@/models/Class";
import Course from "@/models/Course";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .populate("branches")
      .lean();

    // Öğretmenlerin ders verdikleri sınıfları al
    const teachersWithClassInfo = await Promise.all(
      teachers.map(async (teacher) => {
        const courses = await Course.find({ teacher: teacher._id })
          .populate("class", "name")
          .lean();

        const classes = courses.map((course) => course.class.name);
        const uniqueClasses = Array.from(new Set(classes));

        return {
          ...teacher,
          classes: uniqueClasses,
        };
      })
    );

    return NextResponse.json(teachersWithClassInfo);
  } catch (error) {
    console.error("Öğretmenleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Öğretmenler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { name, email, password, branches, classes } = await req.json();

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // Branş ve sınıf kontrolü
    const branchIds = await Branch.find({ _id: { $in: branches } }).distinct(
      "_id"
    );
    const classIds = await Class.find({ _id: { $in: classes } }).distinct(
      "_id"
    );

    if (
      branchIds.length !== branches.length ||
      classIds.length !== classes.length
    ) {
      return NextResponse.json(
        { error: "Geçersiz branş veya sınıf ID'si" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      branches: branchIds,
      classes: classIds,
    });

    const teacherWithoutPassword = await User.findById(newTeacher._id)
      .select("-password")
      .populate("branches")
      .populate("classes");

    return NextResponse.json(teacherWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Öğretmen ekleme hatası:", error);
    return NextResponse.json(
      { error: "Öğretmen eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
