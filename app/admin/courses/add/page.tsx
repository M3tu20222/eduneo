import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddCourseForm } from "@/components/admin/AddCourseForm";

export default async function AddCoursePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  } else if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold cyberpunk-text mb-6">Yeni Ders Ekle</h1>
      <AddCourseForm />
    </div>
  );
}
