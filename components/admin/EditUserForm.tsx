"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentNumber?: string;
}

export function EditUserForm({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      console.log("Fetching user data for ID:", userId);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error("Kullanıcı bilgileri alınamadı");
      }
      const data = await response.json();
      console.log("Fetched user data:", data);
      setUser(data);
    } catch (error) {
      console.error("Kullanıcı bilgilerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kullanıcı bilgileri yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Kullanıcı güncellenirken bir hata oluştu"
        );
      }

      const updatedUser = await response.json();
      console.log("Server response:", updatedUser); // Debug log

      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi",
      });

      // Force a hard refresh of the page
      window.location.href = "/admin/users";
    } catch (error: any) {
      console.error("Kullanıcı güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  if (!user) {
    return <div className="text-center py-4">Kullanıcı bulunamadı</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Kullanıcı Adı
          </label>
          <Input
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            E-posta
          </label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="firstName">
            Ad
          </label>
          <Input
            id="firstName"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="lastName">
            Soyad
          </label>
          <Input
            id="lastName"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Rol
          </label>
          <Select
            value={user.role}
            onValueChange={(value) => setUser({ ...user, role: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Rol seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Öğrenci</SelectItem>
              <SelectItem value="teacher">Öğretmen</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {user.role === "student" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="studentNumber">
              Öğrenci Numarası
            </label>
            <Input
              id="studentNumber"
              value={user.studentNumber || ""}
              onChange={(e) =>
                setUser({ ...user, studentNumber: e.target.value })
              }
              placeholder="Örn: 20230001"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button
            type="submit"
            className="cyberpunk-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              "Kullanıcıyı Güncelle"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
