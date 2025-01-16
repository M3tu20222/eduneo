import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  await dbConnect();

  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const teacher = await User.findOne({ _id: userId, role: "teacher" })
      .populate("courses")
      .populate("branches")
      .lean();

    if (!teacher) {
      console.log("Teacher not found:", userId);
      return NextResponse.json(
        { error: "Öğretmen bulunamadı" },
        { status: 404 }
      );
    }

    const teacherInfo = {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      courses: teacher.courses || [],
      branches: teacher.branches || [],
    };

    return NextResponse.json(teacherInfo);
  } catch (error) {
    console.error("Error fetching teacher info:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
