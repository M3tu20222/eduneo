import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assignment, { IAssignment } from "@/models/Assignment";
import Course from "@/models/Course";
import { Types } from "mongoose";

interface PopulatedAssignment extends Omit<IAssignment, "course" | "class"> {
  course: {
    _id: Types.ObjectId;
    name: string;
  };
  class: {
    _id: Types.ObjectId;
    name: string;
  };
  pointValue: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const {
      title,
      description,
      dueDate,
      course,
      class: classId,
      teacher,
      pointValue = 5, // Varsayılan değer olarak 5 puan eklendi
    } = await req.json();
    console.log("Received data:", {
      title,
      description,
      dueDate,
      course,
      classId,
      teacher,
      pointValue,
    });

    // Fetch the course to ensure it exists and to get its details
    const courseDetails = await Course.findById(course).select("name").lean();
    if (!courseDetails) {
      console.log("Invalid course:", course);
      return NextResponse.json({ error: "Geçersiz ders" }, { status: 400 });
    }

    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      course,
      class: classId,
      teacher,
      pointValue, // Puan değeri eklendi
    });

    console.log("New assignment object:", newAssignment);

    await newAssignment.save();

    // Populate the course and class information
    const populatedAssignment = (await Assignment.findById(newAssignment._id)
      .populate("course", "name")
      .populate("class", "name")
      .lean()) as PopulatedAssignment;

    if (!populatedAssignment) {
      throw new Error("Oluşturulan ödev bulunamadı");
    }

    const formattedAssignment = {
      _id: populatedAssignment._id.toString(),
      title: populatedAssignment.title,
      description: populatedAssignment.description,
      dueDate: populatedAssignment.dueDate.toISOString(),
      pointValue: populatedAssignment.pointValue, // Puan değeri eklendi
      course: {
        _id: populatedAssignment.course._id.toString(),
        name: populatedAssignment.course.name,
      },
      class: {
        _id: populatedAssignment.class._id.toString(),
        name: populatedAssignment.class.name,
      },
    };

    return NextResponse.json(formattedAssignment, { status: 201 });
  } catch (error) {
    console.error("Ödev ekleme hatası:", error);
    return NextResponse.json(
      {
        error: "Ödev eklenirken bir hata oluştu",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "teacher") {
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

    const assignments = (await Assignment.find({ teacher: userId })
      .populate("course", "name")
      .populate("class", "name")
      .lean()) as PopulatedAssignment[];

    const formattedAssignments = assignments.map((assignment) => ({
      _id: assignment._id.toString(),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.toISOString(),
      pointValue: assignment.pointValue, // Puan değeri eklendi
      course: {
        _id: assignment.course._id.toString(),
        name: assignment.course.name,
      },
      class: {
        _id: assignment.class._id.toString(),
        name: assignment.class.name,
      },
    }));

    return NextResponse.json(formattedAssignments);
  } catch (error) {
    console.error("Ödevleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Ödevler alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}
