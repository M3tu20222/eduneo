import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/Assignment";
import SubmissionStatus from "@/models/SubmissionStatus";
import StudentPoint from "@/models/StudentPoint";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "student") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const { assignmentId } = await req.json();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: "Ödev bulunamadı" }, { status: 404 });
    }

    // Ödevin daha önce teslim edilip edilmediğini kontrol et
    let submission = await SubmissionStatus.findOne({
      student: session.user.id,
      assignment: assignmentId,
    });

    if (submission) {
      return NextResponse.json(
        { error: "Bu ödev zaten teslim edilmiş" },
        { status: 400 }
      );
    }

    // Yeni teslim kaydı oluştur
    submission = new SubmissionStatus({
      student: session.user.id,
      assignment: assignmentId,
      submissionDate: new Date(),
      isSubmitted: true,
      pointsEarned: assignment.pointValue,
    });

    await submission.save();

    // Öğrencinin ders puanlarını güncelle
    let studentPoint = await StudentPoint.findOne({
      student: session.user.id,
      course: assignment.course,
    });

    if (!studentPoint) {
      studentPoint = new StudentPoint({
        student: session.user.id,
        course: assignment.course,
        points: 0,
      });
    }

    studentPoint.points += assignment.pointValue;
    await studentPoint.save();

    return NextResponse.json(
      {
        message: "Ödev başarıyla teslim edildi",
        submission,
        pointsEarned: assignment.pointValue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ödev teslim hatası:", error);
    return NextResponse.json(
      { error: "Ödev teslim edilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
