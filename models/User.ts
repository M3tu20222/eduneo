import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "teacher" | "student";
  class?: Types.ObjectId;
  courses: Types.ObjectId[];
  studentNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  studentNumber: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
