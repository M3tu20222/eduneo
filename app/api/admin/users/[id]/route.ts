import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Class from "@/models/Class";
import bcrypt from "bcrypt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching user with ID:", params.id);
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(params.id).select("-password");
    console.log("Found user:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

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

    const {
      username,
      email,
      firstName,
      lastName,
      role,
      studentNumber,
      class: classId,
      password,
    } = await req.json();

    console.log("Received update data:", {
      username,
      email,
      firstName,
      lastName,
      role,
      studentNumber,
      classId,
      password: password ? "[REDACTED]" : undefined,
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

    const updateData: any = {
      username,
      email,
      firstName,
      lastName,
      role,
      updatedAt: new Date(),
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (role === "student") {
      updateData.studentNumber = studentNumber;
      updateData.class = classId;
    } else {
      updateData.studentNumber = undefined;
      updateData.class = undefined;
    }

    console.log("Final update data:", {
      ...updateData,
      password: updateData.password ? "[REDACTED]" : undefined,
    });

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      console.log("User not found for update");
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // If the user is a student and a class is specified, update the class's students array
    if (role === "student" && classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { students: updatedUser._id },
      });

      // Remove the user from any other classes
      await Class.updateMany(
        { _id: { $ne: classId }, students: updatedUser._id },
        { $pull: { students: updatedUser._id } }
      );
    }

    console.log("Final updated user:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

