import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Class from '@/models/Class'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    // Tüm öğrencileri bul
    const students = await User.find({ role: 'student' })

    let updatedCount = 0

    for (const student of students) {
      if (student.class) {
        // Öğrenciyi sınıfa ekle
        const updateResult = await Class.findByIdAndUpdate(
          student.class,
          { $addToSet: { students: student._id } },
          { new: true }
        )

        if (updateResult) {
          updatedCount++
        }
      }
    }

    return NextResponse.json({ message: `${updatedCount} öğrenci sınıflara eklendi.` })
  } catch (error) {
    console.error('Öğrenci güncelleme hatası:', error)
    return NextResponse.json({ error: 'Öğrenciler güncellenirken bir hata oluştu' }, { status: 500 })
  }
}

