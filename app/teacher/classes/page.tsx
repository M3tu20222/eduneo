import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { TeacherClassesList } from '@/components/teacher/TeacherClassesList'

export default async function TeacherClassesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'teacher') {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Sınıflarım</h1>
      <TeacherClassesList userId={session.user.id} />
    </div>
  )
}

