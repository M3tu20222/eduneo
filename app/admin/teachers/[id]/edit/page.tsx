import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditTeacherForm } from "@/components/admin/EditTeacherForm"

export default async function EditTeacherPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  } else if (session.user?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold cyberpunk-text mb-6">Öğretmen Düzenle</h1>
      <EditTeacherForm teacherId={params.id} />
    </div>
  )
}

