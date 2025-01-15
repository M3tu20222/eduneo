import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AssignmentList from "@/components/student/AssignmentList";

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  return <AssignmentList userId={session.user.id} />;
}
