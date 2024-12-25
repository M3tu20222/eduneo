import mongoose, { Document, Model } from "mongoose";

export interface IBranch extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
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

BranchSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Branch: Model<IBranch> =
  mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);

export default Branch;
