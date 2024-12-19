import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Updated import

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

    // Check if email or username is already in use
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta veya kullanıcı adı zaten kullanımda." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role,
      ...(role === "student" && { class: studentClass, studentNumber }),
    };

    // Add user to database
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
