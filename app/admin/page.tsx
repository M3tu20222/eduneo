import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  UserPlus,
  School,
  BookMarked,
} from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  } else if (session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold cyberpunk-text">Admin Paneli</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Hoş geldiniz, {session.user.name}
            </span>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Kullanıcı Yönetimi */}
          <Link href="/admin/users" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <Users className="h-8 w-8 mb-4 text-neon-purple" />
              <h2 className="text-xl font-semibold mb-2">Kullanıcı Yönetimi</h2>
              <p className="text-muted-foreground">
                Öğretmen, öğrenci ve admin kullanıcılarını yönetin
              </p>
            </div>
          </Link>

          {/* Kullanıcı Ekleme */}
          <Link href="/admin/add-user" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <UserPlus className="h-8 w-8 mb-4 text-neon-green" />
              <h2 className="text-xl font-semibold mb-2">Kullanıcı Ekle</h2>
              <p className="text-muted-foreground">
                Yeni öğretmen, öğrenci veya admin ekleyin
              </p>
            </div>
          </Link>

          {/* Branş Yönetimi */}
          <Link href="/admin/branches" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <BookMarked className="h-8 w-8 mb-4 text-neon-yellow" />
              <h2 className="text-xl font-semibold mb-2">Branş Yönetimi</h2>
              <p className="text-muted-foreground">
                Branşları görüntüleyin, oluşturun ve düzenleyin
              </p>
            </div>
          </Link>

          {/* Sınıf Yönetimi */}
          <Link href="/admin/classes" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <School className="h-8 w-8 mb-4 text-neon-blue" />
              <h2 className="text-xl font-semibold mb-2">Sınıf Yönetimi</h2>
              <p className="text-muted-foreground">
                Sınıfları görüntüleyin, oluşturun ve düzenleyin
              </p>
            </div>
          </Link>

          {/* Öğretmen Yönetimi */}
          <Link href="/admin/teachers" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <GraduationCap className="h-8 w-8 mb-4 text-neon-pink" />
              <h2 className="text-xl font-semibold mb-2">Öğretmen Yönetimi</h2>
              <p className="text-muted-foreground">
                Öğretmenleri görüntüleyin, düzenleyin ve branş atayın
              </p>
            </div>
          </Link>

          {/* Ders Yönetimi */}
          <Link href="/admin/courses" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <BookOpen className="h-8 w-8 mb-4 text-neon-blue" />
              <h2 className="text-xl font-semibold mb-2">Ders Yönetimi</h2>
              <p className="text-muted-foreground">
                Dersleri görüntüleyin, oluşturun ve düzenleyin
              </p>
            </div>
          </Link>

          {/* Dönem Yönetimi */}
          <Link href="/admin/terms" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <Calendar className="h-8 w-8 mb-4 text-neon-purple" />
              <h2 className="text-xl font-semibold mb-2">Dönem Yönetimi</h2>
              <p className="text-muted-foreground">
                Akademik dönemleri ve takvimi yönetin
              </p>
            </div>
          </Link>

          {/* Sistem Ayarları */}
          <Link href="/admin/settings" className="block">
            <div className="p-6 bg-card rounded-lg cyberpunk-border cyberpunk-glow hover:scale-105 transition-transform">
              <Settings className="h-8 w-8 mb-4 text-neon-yellow" />
              <h2 className="text-xl font-semibold mb-2">Sistem Ayarları</h2>
              <p className="text-muted-foreground">
                Sistem ayarlarını yapılandırın
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
