import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IClass } from "./Class";
import { ICourse } from "./Course";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  teacher: IUser["_id"];
  class?: IClass["_id"];
  course?: ICourse["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
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

EventSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Fix: Changed 'EventSchema' to 'Event' in the model name
const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
