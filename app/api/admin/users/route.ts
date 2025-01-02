import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// Ensure User model is imported and registered
import "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    // Add debug logging
    console.log("Fetching users...");

    // Explicitly check if User model exists
    if (!User || !User.modelName) {
      console.error("User model not properly initialized");
      throw new Error("User model not properly initialized");
    }

    const users = await User.find({}, "-password").lean();

    // Add debug logging
    console.log(`Found ${users.length} users`);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Kullanıcıları getirme hatası:", error);

    // More detailed error response
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata";
    return NextResponse.json(
      {
        error: "Kullanıcılar alınırken bir hata oluştu",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
