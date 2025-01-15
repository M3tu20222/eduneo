import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { teacherId, message } = await req.json();

    if (!teacherId || !message) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const newMessage = new Message({
      from: session.user.id,
      to: teacherId,
      message,
      sentAt: new Date(),
    });

    await newMessage.save();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
