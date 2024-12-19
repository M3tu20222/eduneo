import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "student") {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Öğrenci Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Derslerim</h2>
          <p>Kayıtlı olduğunuz dersleri görüntüleyin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Ödevlerim</h2>
          <p>Mevcut ödevlerinizi görüntüleyin ve teslim edin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Notlarım</h2>
          <p>
            Ders notlarınızı ve genel akademik performansınızı görüntüleyin.
          </p>
        </div>
      </div>
    </div>
  );
}
