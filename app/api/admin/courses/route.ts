import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Course from '@/models/Course'
import Class from '@/models/Class'
import Branch from '@/models/Branch'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    const { name, code, description, branch, teacher, class: classId } = await req.json()

    // Ders kodu benzersiz olmalı
    const existingCourse = await Course.findOne({ code })
    if (existingCourse) {
      return NextResponse.json({ error: 'Bu ders kodu zaten kullanımda' }, { status: 400 })
    }

    const newCourse = await Course.create({
      name,
      code,
      description,
      branch,
      teacher,
      class: classId,
    })

    // Dersi sınıfa ekle
    await Class.findByIdAndUpdate(classId, {
      $push: { courses: newCourse._id }
    })

    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error('Ders ekleme hatası:', error)
    return NextResponse.json({ error: 'Ders eklenirken bir hata oluştu' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    // Önce modellerin yüklendiğinden emin olalım
    await Promise.all([
      Branch.findOne({}),
      User.findOne({})
    ])

    const courses = await Course.find()
      .populate('branch', 'name')
      .populate('teacher', 'firstName lastName')
      .populate('class', 'name')
      .lean()

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Dersleri getirme hatası:', error)
    return NextResponse.json({ error: 'Dersler alınırken bir hata oluştu' }, { status: 500 })
  }
}

