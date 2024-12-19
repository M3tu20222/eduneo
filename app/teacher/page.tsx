import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">Admin Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>
          <p>Öğretmen ve öğrenci hesaplarını yönetin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Sınıf Yönetimi</h2>
          <p>Sınıfları oluşturun ve düzenleyin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Raporlar</h2>
          <p>Okul genelinde performans raporlarını görüntüleyin.</p>
        </div>
      </div>
    </div>
  );
}
