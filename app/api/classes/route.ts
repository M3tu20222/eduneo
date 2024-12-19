import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/dbConnect'
import Class from '@/models/Class'

export async function GET(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()

  try {
    const classes = await Class.find().populate('teacher', 'name')
    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await dbConnect()

  try {
    const body = await req.json()
    const newClass = await Class.create(body)
    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create class' }, { status: 400 })
  }
}

