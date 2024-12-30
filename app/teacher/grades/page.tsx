import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { GradeList } from "@/components/teacher/grades/GradeList";

export default async function TeacherGradesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold cyberpunk-text">Not Girişi</h1>
      </div>
      <GradeList teacherId={session.user.id} />
    </div>
  );
}
