import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Branch from "@/models/Branch";

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

    const teacher = await User.findById(params.id)
      .select("name email branches")
      .populate("branches", "name");

    if (!teacher) {
      return NextResponse.json(
        { error: "Öğretmen bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Öğretmen getirme hatası:", error);
    return NextResponse.json(
      { error: "Öğretmen alınırken bir hata oluştu" },
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

    const { name, email, branches } = await req.json();

    // E-posta kontrolü
    const existingUser = await User.findOne({ email, _id: { $ne: params.id } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanımda" },
        { status: 400 }
      );
    }

    // Branş kontrolü
    const branchIds = await Branch.find({ _id: { $in: branches } }).distinct(
      "_id"
    );
    if (branchIds.length !== branches.length) {
      return NextResponse.json(
        { error: "Geçersiz branş ID'si" },
        { status: 400 }
      );
    }

    const updatedTeacher = await User.findByIdAndUpdate(
      params.id,
      { name, email, branches: branchIds },
      { new: true, runValidators: true }
    )
      .select("name email branches")
      .populate("branches", "name");

    if (!updatedTeacher) {
      return NextResponse.json(
        { error: "Öğretmen bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("Öğretmen güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Öğretmen güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
