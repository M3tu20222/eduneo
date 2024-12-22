"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// Türkçe karakterleri İngilizce karakterlere dönüştürme
const convertToNonAccented = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c");
};

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

  // Öğrenci bilgilerinden otomatik kullanıcı adı oluşturma
  const generateUsername = (
    firstName: string,
    lastName: string,
    studentNumber: string,
    className: string
  ) => {
    if (!firstName || !lastName || !studentNumber || !className) return "";

    // İsmin ilk 2 harfi + öğrenci no + soyismin ilk 2 harfi + sınıf kodu (sayı ve harf)
    const firstNamePrefix = convertToNonAccented(firstName).substring(0, 2);
    const lastNamePrefix = convertToNonAccented(lastName).substring(0, 2);
    const classCode = convertToNonAccented(className.replace("-", ""));

    return `${firstNamePrefix}${studentNumber}${lastNamePrefix}${classCode}`;
  };

  // Öğrenci bilgilerinden otomatik e-posta oluşturma
  const generateEmail = (username: string) => {
    if (!username) return "";
    return `${username}@24agustos.com`;
  };

  // Öğrenci bilgilerinden otomatik şifre oluşturma
  const generatePassword = (username: string) => {
    if (!username) return "";
    return `24${username}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Eğer rol öğrenci ise ve gerekli bilgiler doluysa otomatik alanları oluştur
      if (newData.role === "student") {
        const selectedClass = classes.find((c) => c._id === newData.class);
        const className = selectedClass ? selectedClass.name : "";

        if (
          newData.firstName &&
          newData.lastName &&
          newData.studentNumber &&
          className
        ) {
          const username = generateUsername(
            newData.firstName,
            newData.lastName,
            newData.studentNumber,
            className
          );
          newData.username = username;
          newData.email = generateEmail(username);
          newData.password = generatePassword(username);
        }
      }

      return newData;
    });
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

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Rol
          </label>
          <Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full p-2 bg-background text-foreground"
          >
            <option value="">Rol Seçin</option>
            <option value="student">Öğrenci</option>
            <option value="teacher">Öğretmen</option>
            <option value="admin">Admin</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="firstName">
            Ad
          </label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full p-2 bg-background text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="lastName">
            Soyad
          </label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full p-2 bg-background text-foreground"
          />
        </div>

        {formData.role === "student" && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="class">
                Sınıf
              </label>
              <Select
                name="class"
                value={formData.class}
                onChange={handleInputChange}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="studentNumber">
                Öğrenci Numarası
              </label>
              <Input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-background text-foreground"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="username">
            Kullanıcı Adı
          </label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            readOnly={formData.role === "student"}
            className="w-full p-2 bg-background text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            E-posta
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            readOnly={formData.role === "student"}
            className="w-full p-2 bg-background text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Şifre
          </label>
          <Input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            readOnly={formData.role === "student"}
            className="w-full p-2 bg-background text-foreground"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" className="w-full cyberpunk-button">
          Kullanıcı Ekle
        </Button>
      </form>
    </div>
  );
}
