import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string;
  teacher: Types.ObjectId;
  students: Types.ObjectId[];
  branch: Types.ObjectId;
  class: Types.ObjectId;
}

const CourseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
});

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
