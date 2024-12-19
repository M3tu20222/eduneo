"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function RegisterForm() {
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
  const [error, setError] = useState("");
  const router = useRouter();

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
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Kayıt işlemi başarısız oldu.");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg cyberpunk-border cyberpunk-glow"
    >
      <h2 className="text-2xl font-bold mb-6 cyberpunk-text text-center">
        Kayıt Ol
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
          <Input
            type="text"
            name="class"
            placeholder="Sınıf"
            value={formData.class}
            onChange={handleChange}
            required
            className="w-full p-2 bg-background text-foreground"
          />
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
        Kayıt Ol
      </Button>
    </form>
  );
}
