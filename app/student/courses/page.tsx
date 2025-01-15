import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CourseList from "@/components/student/CourseList";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    redirect("/login");
  }

  return <CourseList userId={session.user.id} />;
}
