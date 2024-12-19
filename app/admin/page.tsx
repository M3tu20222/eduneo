import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  console.log("Admin page session:", session); // Debug için

  if (!session) {
    console.log("No session, redirecting to login"); // Debug için
    redirect("/login");
  } else if (session.user?.role !== "admin") {
    console.log("User role is not admin:", session.user?.role); // Debug için
    redirect("/dashboard"); // Admin değilse ana sayfaya yönlendir
  }

  return <div>Admin sayfası</div>;
}
