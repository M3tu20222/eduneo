import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditBranchForm } from "@/components/admin/EditBranchForm"

export default async function EditBranchPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  } else if (session.user?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold cyberpunk-text mb-6">Branş Düzenle</h1>
      <EditBranchForm branchId={params.id} />
    </div>
  )
}

