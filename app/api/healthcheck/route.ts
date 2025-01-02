import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      status: "ok",
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 }
    );
  }
}
