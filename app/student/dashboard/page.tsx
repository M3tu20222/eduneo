import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentDashboard from "@/components/student/StudentDashboard";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  return <StudentDashboard userId={session.user.id} />;
}
