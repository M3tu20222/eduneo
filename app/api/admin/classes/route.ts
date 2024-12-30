import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Class from '@/models/Class'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    const classes = await Class.find()
      .populate('classTeacher', 'firstName lastName')
      .populate('students')
      .lean()

    const formattedClasses = classes.map(cls => ({
      _id: cls._id,
      name: cls.name,
      academicYear: cls.academicYear,
      classTeacherName: cls.classTeacher ? 
        `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}` : 
        'Atanmamış',
      studentCount: cls.students ? cls.students.length : 0,
      isActive: cls.isActive
    }))

    console.log('Formatted classes:', formattedClasses); // Debugging için log

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error('Sınıfları getirme hatası:', error)
    return NextResponse.json({ error: 'Sınıflar alınırken bir hata oluştu' }, { status: 500 })
  }
}

