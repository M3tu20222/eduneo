import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;
    const {
      title,
      description,
      dueDate,
      course,
      class: classId,
    } = await req.json();

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, dueDate, course, class: classId },
      { new: true, runValidators: true }
    )
      .populate("course", "name")
      .populate("class", "name");

    if (!updatedAssignment) {
      return NextResponse.json({ error: "Ödev bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("Ödev güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Ödev güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return NextResponse.json({ error: "Ödev bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ödev başarıyla silindi" });
  } catch (error) {
    console.error("Ödev silme hatası:", error);
    return NextResponse.json(
      { error: "Ödev silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
