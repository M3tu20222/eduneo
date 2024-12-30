import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'teacher') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID\'si gerekli' }, { status: 400 })
    }

    await dbConnect()

    const events = await Event.find({ teacher: userId }).lean()

    return NextResponse.json(events)
  } catch (error) {
    console.error('Öğretmen etkinlikleri getirme hatası:', error)
    return NextResponse.json({ error: 'Etkinlikler alınırken bir hata oluştu' }, { status: 500 })
  }
}

