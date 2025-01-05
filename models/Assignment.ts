import mongoose, { Document, Schema } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  teacher: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  class: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  pointValue: number;
}

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  pointValue: { type: Number, default: 5 },
});

AssignmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Assignment =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
