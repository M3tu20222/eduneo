import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  branches: Types.ObjectId[];
  classes?: Types.ObjectId[];
  studentNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  studentNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
