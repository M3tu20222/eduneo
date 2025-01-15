import mongoose, { Schema, Document } from "mongoose";

export interface IStudentBadge extends Document {
  student: mongoose.Types.ObjectId;
  badge: mongoose.Types.ObjectId;
  earnedAt: Date;
}

const StudentBadgeSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  badge: { type: Schema.Types.ObjectId, ref: "Badge", required: true },
  earnedAt: { type: Date, default: Date.now },
});

export default mongoose.models.StudentBadge ||
  mongoose.model<IStudentBadge>("StudentBadge", StudentBadgeSchema);
