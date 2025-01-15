import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Assignment from "@/models/Assignment";
import SubmissionStatus from "@/models/SubmissionStatus";

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

    const assignments = await Assignment.find({ course: { $in: user.courses } })
      .populate("course", "name")
      .lean();

    const submissionStatuses = await SubmissionStatus.find({
      student: userId,
    }).lean();

    const assignmentsWithStatus = assignments.map((assignment: any) => {
      const submission = submissionStatuses.find(
        (status) => status.assignment.toString() === assignment._id.toString()
      );

      let status = "Bekliyor";
      if (submission) {
        status = submission.isSubmitted ? "Tamamlandı" : "Gecikti";
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        course: assignment.course.name,
        dueDate: assignment.dueDate,
        status: status,
      };
    });

    return NextResponse.json(assignmentsWithStatus);
  } catch (error) {
    console.error("Ödevler alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Ödevler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
