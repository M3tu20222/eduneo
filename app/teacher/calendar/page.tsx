import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { TeacherCalendar } from '@/components/teacher/TeacherCalendar'

export default async function TeacherCalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'teacher') {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Takvim</h1>
      <TeacherCalendar userId={session.user.id} />
    </div>
  )
}

