import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("test")
    
    const result = await db.command({ ping: 1 })
    console.log("MongoDB bağlantısı başarılı:", result)
    
    return NextResponse.json({ message: "MongoDB bağlantısı başarılı" })
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error)
    return NextResponse.json({ error: "MongoDB bağlantı hatası" }, { status: 500 })
  }
}

