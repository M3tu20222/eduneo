import mongoose, { Schema, Document } from "mongoose";

export interface ISubmissionStatus extends Document {
  student: mongoose.Types.ObjectId;
  assignment: mongoose.Types.ObjectId;
  submissionDate: Date;
  isSubmitted: boolean;
  pointsEarned: number;
}

const SubmissionStatusSchema = new Schema<ISubmissionStatus>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Bileşik index oluşturarak aynı öğrencinin aynı ödevi birden fazla kez teslim etmesini engelliyoruz
SubmissionStatusSchema.index({ student: 1, assignment: 1 }, { unique: true });

export default mongoose.models.SubmissionStatus ||
  mongoose.model<ISubmissionStatus>("SubmissionStatus", SubmissionStatusSchema);
