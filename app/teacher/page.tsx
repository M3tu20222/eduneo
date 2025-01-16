import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {TeacherDashboard} from "@/components/teacher/TeacherDashboard";

export default async function TeacherPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    redirect("/login");
  }

  return <TeacherDashboard userId={session.user.id} />;
}
