import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Branch from "@/models/Branch";

// Belirli bir branşı getir
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

    const branch = await Branch.findById(params.id);
    if (!branch) {
      return NextResponse.json({ error: "Branş bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(branch);
  } catch (error) {
    console.error("Branş getirme hatası:", error);
    return NextResponse.json(
      { error: "Branş alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Branşı güncelle
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

    const body = await req.json();
    const updatedBranch = await Branch.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBranch) {
      return NextResponse.json({ error: "Branş bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(updatedBranch);
  } catch (error: any) {
    console.error("Branş güncelleme hatası:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu isimde bir branş zaten mevcut" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Branş güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Branşı sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const deletedBranch = await Branch.findByIdAndDelete(params.id);
    if (!deletedBranch) {
      return NextResponse.json({ error: "Branş bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Branş başarıyla silindi" });
  } catch (error) {
    console.error("Branş silme hatası:", error);
    return NextResponse.json(
      { error: "Branş silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
