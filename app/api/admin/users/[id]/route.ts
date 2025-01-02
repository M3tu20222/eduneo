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

    // Validate the user exists first
    const existingUser = await User.findById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Check if email is already in use by another user
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

    // Preserve existing fields and update only what's provided
    const updateData = {
      ...existingUser.toObject(),
      username,
      email,
      firstName,
      lastName,
      role,
      updatedAt: new Date(),
    };

    // Handle student specific fields
    if (role === "student") {
      updateData.studentNumber = studentNumber;
    }

    console.log("Updating user with data:", updateData); // Debug log

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Kullanıcı güncellenemedi" },
        { status: 404 }
      );
    }

    console.log("Updated user:", updatedUser); // Debug log
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
