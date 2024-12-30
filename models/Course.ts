import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from './User'
import { IClass } from './Class'
import { IBranch } from './Branch'

export interface ICourse extends Document {
  name: string
  code: string
  description?: string
  branch: IBranch['_id']
  teacher: IUser['_id']
  class: IClass['_id']
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  code: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: { 
    type: String, 
    trim: true 
  },
  branch: { 
    type: Schema.Types.ObjectId, 
    ref: 'Branch',
    required: true
  },
  teacher: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  class: { 
    type: Schema.Types.ObjectId, 
    ref: 'Class',
    required: true
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

CourseSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)

export default Course

