import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Class from '@/models/Class'
import User from '@/models/User'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    const classData = await Class.findById(params.id)
      .populate('classTeacher', 'name')
      .populate('students', 'name')

    if (!classData) {
      return NextResponse.json({ error: 'Sınıf bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(classData)
  } catch (error) {
    console.error('Sınıf getirme hatası:', error)
    return NextResponse.json({ error: 'Sınıf alınırken bir hata oluştu' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    const { name, academicYear, classTeacher, students } = await req.json()

    // Sınıf öğretmeninin varlığını ve rolünü kontrol et
    const teacher = await User.findById(classTeacher)
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ error: 'Geçersiz sınıf öğretmeni' }, { status: 400 })
    }

    // Öğrencilerin varlığını ve rollerini kontrol et
    if (students && students.length > 0) {
      for (const studentId of students) {
        const student = await User.findById(studentId)
        if (!student || student.role !== 'student') {
          return NextResponse.json({ error: 'Geçersiz öğrenci' }, { status: 400 })
        }
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      params.id,
      { name, academicYear, classTeacher, students },
      { new: true, runValidators: true }
    )
      .populate('classTeacher', 'name')
      .populate('students', 'name')

    if (!updatedClass) {
      return NextResponse.json({ error: 'Sınıf bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(updatedClass)
  } catch (error: any) {
    console.error('Sınıf güncelleme hatası:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Bu sınıf adı ve akademik yıl kombinasyonu zaten mevcut' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Sınıf güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

