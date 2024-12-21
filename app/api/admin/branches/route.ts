import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Branch from "@/models/Branch";

// Tüm branşları getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const branches = await Branch.find().sort({ name: 1 });
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Branşları getirme hatası:", error);
    return NextResponse.json(
      { error: "Branşlar alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni branş ekle
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const newBranch = await Branch.create(body);
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error: any) {
    console.error("Branş ekleme hatası:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu isimde bir branş zaten mevcut" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Branş eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
