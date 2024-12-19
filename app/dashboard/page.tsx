import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  if (role === "admin") {
    redirect("/admin");
  } else if (role === "teacher") {
    redirect("/teacher");
  } else if (role === "student") {
    redirect("/student");
  }

  return <div>Yönlendiriliyor...</div>;
}
