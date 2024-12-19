import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 cyberpunk-text">
        Öğretmen Paneli
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Sınıflarım</h2>
          <p>Sorumlu olduğunuz sınıfları görüntüleyin ve yönetin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Ödev Yönetimi</h2>
          <p>Ödev oluşturun, düzenleyin ve değerlendirin.</p>
        </div>
        <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow">
          <h2 className="text-xl font-semibold mb-4">Not Girişi</h2>
          <p>Öğrenci notlarını girin ve düzenleyin.</p>
        </div>
      </div>
    </div>
  );
}
