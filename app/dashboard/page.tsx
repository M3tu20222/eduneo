import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null;

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

  // If the role is not defined or is an unknown role
  return <div>Geçersiz rol. Lütfen sistem yöneticisi ile iletişime geçin.</div>;
}
