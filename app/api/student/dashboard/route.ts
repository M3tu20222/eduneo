import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import Grade from "@/models/Grade";
import Attendance, { IAttendance } from "@/models/Attendance";
import StudentBadge from "@/models/StudentBadge";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si gerekli" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate("courses");
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Ders programını al
    const schedule = await Course.find({ _id: { $in: user.courses } })
      .select("name schedule teacher classroom")
      .populate("teacher", "name")
      .lean();

    // Ödevleri al
    const assignments = await Assignment.find({ course: { $in: user.courses } })
      .select("title course dueDate")
      .populate("course", "name")
      .lean();

    // Notları al
    const grades = await Grade.find({ student: userId })
      .select("course grade")
      .populate("course", "name")
      .lean();

    // Devamsızlık bilgilerini al
    const attendance = (await Attendance.find({ student: userId })
      .select("course totalClasses attendedClasses")
      .populate("course", "name")
      .lean()) as IAttendance[];

    // Öğretmenleri al
    const teachers = await User.find({
      role: "teacher",
      _id: { $in: schedule.map((s) => s.teacher) },
    })
      .select("name")
      .lean();

    // Rozetleri al
    const studentBadges = await StudentBadge.find({ student: userId })
      .populate("badge")
      .lean();

    const studentData = {
      schedule: schedule.map((course) => ({
        day: course.schedule.day,
        courses: [
          {
            name: course.name,
            time: course.schedule.time,
            teacher: course.teacher.name,
            classroom: course.classroom,
          },
        ],
      })),
      assignments: assignments.map((assignment) => ({
        id: assignment._id,
        title: assignment.title,
        course: assignment.course.name,
        dueDate: assignment.dueDate,
        status: "Bekliyor", // Bu kısmı gerçek duruma göre güncellemelisiniz
      })),
      grades: grades.map((grade) => ({
        course: grade.course.name,
        grade: grade.grade,
      })),
      attendance: attendance.map((att: any) => ({
        course: att.course?.name || "Bilinmeyen Ders",
        totalClasses: att.totalClasses || 0,
        attendedClasses: att.attendedClasses || 0,
      })),
      teachers: teachers.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
      })),
      badges: studentBadges.map((sb) => ({
        id: sb.badge._id,
        name: sb.badge.name,
        description: sb.badge.description,
        icon: sb.badge.icon,
        earnedAt: sb.earnedAt,
      })),
    };

    return NextResponse.json(studentData);
  } catch (error) {
    console.error("Öğrenci dashboard verisi alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Veriler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
