import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      username,
      password,
      email,
      firstName,
      lastName,
      role,
      class: studentClass,
      studentNumber,
    } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    // E-posta veya kullanıcı adının zaten kullanımda olup olmadığını kontrol et
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta veya kullanıcı adı zaten kullanımda." },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = {
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role,
      ...(role === "student" && { class: studentClass, studentNumber }),
    };

    // Kullanıcıyı veritabanına ekle
    await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      { message: "Kullanıcı başarıyla eklendi." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kullanıcı ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
