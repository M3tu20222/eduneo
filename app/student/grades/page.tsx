import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GradeOverview from "@/components/student/GradeOverview";

export default async function GradesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  return <GradeOverview userId={session.user.id} />;
}
