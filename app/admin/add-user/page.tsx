import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddUserForm } from "@/components/admin/AddUserForm";

export default async function AddUserPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Kullanıcı Ekle</h1>
      <div className="max-w-2xl">
        <AddUserForm />
      </div>
    </div>
  );
}
