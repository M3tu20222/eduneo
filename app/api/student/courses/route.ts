import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si bulunamadı" },
        { status: 400 }
      );
    }

    console.log("Fetching user with ID:", userId);

    const user = await User.findById(userId).populate({
      path: "courses",
      select: "name code",
      populate: { path: "teacher", select: "firstName lastName" },
    });

    console.log("User from database:", JSON.stringify(user, null, 2));

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    if (!user.courses || user.courses.length === 0) {
      console.log("No courses found for user");
      return NextResponse.json([]);
    }

    const courses = user.courses.map((course: any) => ({
      _id: course._id.toString(),
      name: course.name,
      code: course.code,
      teacher: course.teacher
        ? `${course.teacher.firstName} ${course.teacher.lastName}`
        : "Atanmamış",
    }));

    console.log("Courses returned:", courses);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Dersler alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Dersler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
