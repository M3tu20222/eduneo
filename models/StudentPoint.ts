import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './User'
import { ICourse } from './Course'

export interface IStudentPoint extends Document {
  student: IUser['_id']
  course: ICourse['_id']
  points: number
  createdAt: Date
  updatedAt: Date
}

const StudentPointSchema = new Schema({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  course: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course',
    required: true
  },
  points: { 
    type: Number, 
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
})

StudentPointSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const StudentPoint = mongoose.models.StudentPoint || mongoose.model<IStudentPoint>('StudentPoint', StudentPointSchema)

export default StudentPoint

