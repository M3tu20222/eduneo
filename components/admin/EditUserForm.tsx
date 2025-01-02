"use client";

import { useState, useEffect } from "react";
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
  class?: string;
}

interface Class {
  _id: string;
  name: string;
}

export function EditUserForm({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }
        const data = await response.json();
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
    };

    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/admin/classes");
        if (!response.ok) {
          throw new Error("Sınıflar alınamadı");
        }
        const data = await response.json();
        console.log("Fetched classes:", data); // Debug için log
        if (!Array.isArray(data)) {
          throw new Error("Geçersiz sınıf verisi");
        }
        setClasses(data);
      } catch (error) {
        console.error("Sınıfları getirme hatası:", error);
        toast({
          title: "Hata",
          description: "Sınıflar yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    };

    fetchUser();
    fetchClasses();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          studentNumber: user.studentNumber,
          class: user.class,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Kullanıcı güncellenirken bir hata oluştu"
        );
      }

      const updatedUser = await response.json();
      console.log("Server response:", updatedUser);

      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi",
      });

      router.push("/admin/users");
      router.refresh();
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
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
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
        <label htmlFor="email" className="text-sm font-medium">
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
        <label htmlFor="firstName" className="text-sm font-medium">
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
        <label htmlFor="lastName" className="text-sm font-medium">
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
        <label htmlFor="role" className="text-sm font-medium">
          Rol
        </label>
        <Select
          value={user.role}
          onValueChange={(value) => setUser({ ...user, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rol seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Öğretmen</SelectItem>
            <SelectItem value="student">Öğrenci</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {user.role === "student" && (
        <>
          <div className="space-y-2">
            <label htmlFor="studentNumber" className="text-sm font-medium">
              Öğrenci Numarası
            </label>
            <Input
              id="studentNumber"
              value={user.studentNumber || ""}
              onChange={(e) =>
                setUser({ ...user, studentNumber: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="class" className="text-sm font-medium">
              Sınıf
            </label>
            <Select
              value={user.class || ""}
              onValueChange={(value) => setUser({ ...user, class: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sınıf seçin" />
              </SelectTrigger>
              <SelectContent>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Sınıf bulunamadı
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Güncelleniyor...
          </>
        ) : (
          "Kullanıcıyı Güncelle"
        )}
      </Button>
    </form>
  );
}
