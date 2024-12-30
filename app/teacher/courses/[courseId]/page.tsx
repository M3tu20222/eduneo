import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { GradeEntrySystem } from "@/components/teacher/GradeEntrySystem";

export default async function TeacherCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">
        Course Management
      </h1>
      <GradeEntrySystem
        teacherId={session.user.id}
        courseId={params.courseId}
      />
    </div>
  );
}
