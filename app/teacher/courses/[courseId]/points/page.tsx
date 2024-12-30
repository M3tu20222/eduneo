import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { StudentPointList } from '@/components/teacher/StudentPointList'

export default async function TeacherCoursePointsPage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'teacher') {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Ders İçi Puanlar</h1>
      <StudentPointList courseId={params.courseId} />
    </div>
  )
}

