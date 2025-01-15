import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
}

const BadgeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

export default mongoose.models.Badge ||
  mongoose.model<IBadge>("Badge", BadgeSchema);
