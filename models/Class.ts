import mongoose, { Document, Types } from 'mongoose'

export interface IClass extends Document {
  name: string;
  academicYear: string;
  classTeacher: Types.ObjectId;
  branchTeachers: Types.ObjectId[];
  courses: Types.ObjectId[];
  students: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  academicYear: { 
    type: String, 
    required: true,
    default: new Date().getFullYear().toString() 
  },
  classTeacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  branchTeachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Sınıf adı ve akademik yıl kombinasyonu benzersiz olmalı
ClassSchema.index({ name: 1, academicYear: 1 }, { unique: true })

const ClassModel = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema)

export default ClassModel

