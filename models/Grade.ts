import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { ICourse } from "./Course";

export interface IGrade extends Document {
  student: IUser["_id"];
  course: ICourse["_id"];
  type: "exam" | "homework" | "project" | "other";
  value: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  type: {
    type: String,
    enum: ["exam", "homework", "project", "other"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

GradeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Grade =
  mongoose.models.Grade || mongoose.model<IGrade>("Grade", GradeSchema);

export default Grade;
