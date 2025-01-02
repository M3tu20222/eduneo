import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

    console.log("Received update data:", {
      username,
      email,
      firstName,
      lastName,
      role,
      studentNumber,
    });

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

    const updateData = {
      username,
      email,
      firstName,
      lastName,
      role,
      ...(role === "student"
        ? { studentNumber }
        : { $unset: { studentNumber: 1 } }),
      updatedAt: new Date(),
    };

    console.log("Updating user with data:", updateData);

    const updatedUser = await User.findOneAndUpdate(
      { _id: params.id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      console.log("User not found for update");
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    console.log("Updated user:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
