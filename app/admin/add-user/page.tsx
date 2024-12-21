"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Class {
  _id: string;
  name: string;
}

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    class: "",
    studentNumber: "",
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/admin/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        console.error("Sınıflar alınamadı");
      }
    } catch (error) {
      console.error("Sınıfları getirme hatası:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const data = await response.json();
        setError(data.message || "Kullanıcı ekleme işlemi başarısız oldu.");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg cyberpunk-border cyberpunk-glow"
      >
        <h2 className="text-2xl font-bold mb-6 cyberpunk-text text-center">
          Yeni Kullanıcı Ekle
        </h2>
        <Input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        />
        <Input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        />
        <Input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        />
        <Input
          type="text"
          name="firstName"
          placeholder="Ad"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        />
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full p-2 bg-background text-foreground"
        >
          <option value="">Rol Seçin</option>
          <option value="student">Öğrenci</option>
          <option value="teacher">Öğretmen</option>
          <option value="admin">Admin</option>
        </Select>
        {formData.role === "student" && (
          <>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
              className="w-full p-2 bg-background text-foreground"
            >
              <option value="">Sınıf Seçin</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              name="studentNumber"
              placeholder="Öğrenci Numarası"
              value={formData.studentNumber}
              onChange={handleChange}
              required
              className="w-full p-2 bg-background text-foreground"
            />
          </>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full cyberpunk-button">
          Kullanıcı Ekle
        </Button>
      </form>
    </div>
  );
}
