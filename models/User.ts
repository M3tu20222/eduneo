import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
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

export default mongoose.models.User || mongoose.model("User", UserSchema);
