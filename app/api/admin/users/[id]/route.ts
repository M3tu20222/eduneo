import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    console.log("Fetched user:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Kullanıcı getirme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı alınırken bir hata oluştu" },
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

    const { username, email, firstName, lastName, role, studentNumber } =
      await req.json();

    // Find the existing user
    const existingUser = await User.findById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Check if email is already in use by another user
    if (email !== existingUser.email) {
      const emailInUse = await User.findOne({
        email,
        _id: { $ne: params.id },
      });
      if (emailInUse) {
        return NextResponse.json(
          {
            error:
              "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor",
          },
          { status: 400 }
        );
      }
    }

    // Update user fields
    existingUser.username = username;
    existingUser.email = email;
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.role = role;
    if (role === "student") {
      existingUser.studentNumber = studentNumber;
    } else {
      existingUser.studentNumber = undefined;
    }
    existingUser.updatedAt = new Date();

    console.log("Updating user with data:", existingUser.toObject()); // Debug log

    // Save the updated user
    const updatedUser = await existingUser.save();

    console.log("Updated user:", updatedUser.toObject()); // Debug log
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}