import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { CourseList } from "@/components/admin/CourseList"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  } else if (session.user?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold cyberpunk-text">Ders Yönetimi</h1>
        <Link href="/admin/courses/add">
          <Button className="cyberpunk-button">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ders Ekle
          </Button>
        </Link>
      </div>
      <CourseList />
    </div>
  )
}

