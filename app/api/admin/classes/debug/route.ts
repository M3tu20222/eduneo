import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ClassModel, { IClass } from "@/models/Class";
import mongoose from "mongoose";

async function getDirectDatabaseInfo() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  const classesCollection = db.collection("classes");
  const classCount = await classesCollection.countDocuments();
  const sampleClasses = await classesCollection.find().limit(5).toArray();

  return {
    collections: collectionNames,
    classCount: classCount,
    sampleClasses: sampleClasses,
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await dbConnect();

    const classes = await ClassModel.find().lean();
    const directDbInfo = await getDirectDatabaseInfo();

    const debugInfo = classes.map((cls) => {
      const typedCls = cls as IClass & { _id: mongoose.Types.ObjectId };
      return {
        _id: typedCls._id.toString(),
        name: typedCls.name,
        academicYear: typedCls.academicYear,
        studentCount: typedCls.students ? typedCls.students.length : 0,
        studentIds: typedCls.students
          ? typedCls.students.map((s) => s.toString())
          : [],
        rawData: cls,
      };
    });

    return NextResponse.json({
      message: "Debug bilgisi başarıyla alındı",
      classCount: classes.length,
      debugInfo: debugInfo,
      directDatabaseInfo: directDbInfo,
    });
  } catch (error) {
    console.error("Debug bilgisi alınırken hata:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
    return NextResponse.json(
      { error: "Debug bilgisi alınamadı", details: errorMessage },
      { status: 500 }
    );
  }
}
