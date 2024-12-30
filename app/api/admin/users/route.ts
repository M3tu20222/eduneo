import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    await dbConnect()

    const users = await User.find({}, '-password').lean()

    return NextResponse.json(users)
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error)
    return NextResponse.json({ error: 'Kullanıcılar alınırken bir hata oluştu' }, { status: 500 })
  }
}

