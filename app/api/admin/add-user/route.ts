import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import Class from "@/models/Class";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const {
      username,
      password,
      email,
      firstName,
      lastName,
      role,
      class: classId,
      studentNumber,
      courses,
    } = await req.json();

    // Check if email or username is already in use
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta veya kullanıcı adı zaten kullanımda." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role,
      ...(role === "student" && { class: classId, studentNumber }),
    });

    // If the user is a student, add them to the class and assign courses
    if (role === "student" && classId) {
      // Add user to the class
      await Class.findByIdAndUpdate(
        classId,
        { $push: { students: newUser._id } },
        { new: true }
      );

      // Assign courses to the user
      if (courses && courses.length > 0) {
        const courseDocs = await Course.find({
          _id: { $in: courses },
          class: classId,
        });
        newUser.courses = courseDocs.map((course) => course._id);
      } else {
        // If no courses were selected, assign all courses for the class
        const classCourses = await Course.find({ class: classId });
        newUser.courses = classCourses.map((course) => course._id);
      }
    }

    // Save the new user
    await newUser.save();

    return NextResponse.json(
      { message: "Kullanıcı başarıyla eklendi.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kullanıcı ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

// Add a GET method to ensure the route is recognized
export async function GET() {
  return NextResponse.json(
    { message: "This route only supports POST requests" },
    { status: 405 }
  );
}
