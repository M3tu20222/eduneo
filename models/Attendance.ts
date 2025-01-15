import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  course: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
  student: mongoose.Types.ObjectId;
  totalClasses: number;
  attendedClasses: number;
}

const AttendanceSchema: Schema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalClasses: { type: Number, required: true },
  attendedClasses: { type: Number, required: true },
});

export default mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);
