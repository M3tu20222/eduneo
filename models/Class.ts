import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branchTeachers: [
    {
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      branch: { type: String, required: true }, // örn: "Matematik", "Fizik"
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  academicYear: {
    type: String,
    required: true,
    default: new Date().getFullYear().toString(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sınıf adı ve akademik yıl kombinasyonu benzersiz olmalı
ClassSchema.index({ name: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
