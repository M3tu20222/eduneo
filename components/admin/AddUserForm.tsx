"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Class {
  _id: string;
  name: string;
}

interface FormData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  class: string;
  studentNumber: string;
}

// Yardımcı fonksiyonlar
const generateUsername = (
  firstName: string,
  lastName: string,
  studentNumber: string,
  className: string
): string => {
  if (!firstName || !lastName || !studentNumber || !className) return "";

  // İlk iki harf + öğrenci no + soyadın ilk iki harfi + sınıf (sayı ve harf)
  const firstTwo = firstName.toLowerCase().substring(0, 2);
  const lastTwo = lastName.toLowerCase().substring(0, 2);
  const classNumber = className.replace(/[^0-9]/g, ""); // Sadece sayıları al
  const classLetter = className.replace(/[^A-Za-z]/g, "").toLowerCase(); // Sadece harfleri al

  return `${firstTwo}${studentNumber}${lastTwo}${classNumber}${classLetter}`;
};

const generateEmail = (username: string): string => {
  if (!username) return "";
  return `${username}@24agustos.com`;
};

const generatePassword = (username: string): string => {
  if (!username) return "";
  return `24${username}`;
};

export function AddUserForm() {
  const [formData, setFormData] = useState<FormData>({
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
  const [loading, setLoading] = useState(false);
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

  const handleStudentInfoChange = (name: string, value: string) => {
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Öğrenci rolü seçiliyse ve gerekli bilgiler doluysa
    if (
      formData.role === "student" &&
      updatedFormData.firstName &&
      updatedFormData.lastName &&
      updatedFormData.studentNumber
    ) {
      // Sınıf adını bul
      const selectedClass = classes.find(
        (c) => c._id === updatedFormData.class
      );
      const className = selectedClass ? selectedClass.name : "";

      if (className) {
        // Kullanıcı adını oluştur
        const username = generateUsername(
          updatedFormData.firstName,
          updatedFormData.lastName,
          updatedFormData.studentNumber,
          className
        );

        // Email ve şifreyi oluştur
        const email = generateEmail(username);
        const password = generatePassword(username);

        // Form verilerini güncelle
        setFormData((prev) => ({
          ...prev,
          ...updatedFormData,
          username,
          email,
          password,
        }));
      }
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError("");

     try {
       const response = await fetch("/api/admin/add-user", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData),
       });

       if (!response.ok) {
         const data = await response.json();
         throw new Error(
           data.message || "Kullanıcı ekleme işlemi başarısız oldu."
         );
       }

       const result = await response.json();
       console.log("Kullanıcı ekleme sonucu:", result);

       toast({
         title: "Başarılı",
         description: "Kullanıcı başarıyla eklendi",
       });

       router.push("/admin/users");
       router.refresh();
     } catch (err) {
       console.error("Kullanıcı ekleme hatası:", err);
       const errorMessage =
         err instanceof Error
           ? err.message
           : "Bir hata oluştu. Lütfen tekrar deneyin.";
       setError(errorMessage);
       toast({
         title: "Hata",
         description: errorMessage,
         variant: "destructive",
       });
     } finally {
       setLoading(false);
     }
   };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto p-8 bg-card rounded-lg cyberpunk-border cyberpunk-glow"
    >
      <h2 className="text-2xl font-bold mb-6 cyberpunk-text text-center">
        Yeni Kullanıcı Ekle
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Rol</label>
          <Select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="w-full"
          >
            <option value="">Rol Seçin</option>
            <option value="student">Öğrenci</option>
            <option value="teacher">Öğretmen</option>
            <option value="admin">Admin</option>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Ad</label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={(e) =>
              handleStudentInfoChange("firstName", e.target.value)
            }
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Soyad</label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={(e) =>
              handleStudentInfoChange("lastName", e.target.value)
            }
            required
            className="w-full"
          />
        </div>

        {formData.role === "student" && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Sınıf</label>
              <Select
                name="class"
                value={formData.class}
                onChange={(e) =>
                  handleStudentInfoChange("class", e.target.value)
                }
                required
                className="w-full"
              >
                <option value="">Sınıf Seçin</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Öğrenci Numarası
              </label>
              <Input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={(e) =>
                  handleStudentInfoChange("studentNumber", e.target.value)
                }
                required
                className="w-full"
              />
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">
            Kullanıcı Adı
          </label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            className="w-full"
            readOnly={formData.role === "student"}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">E-posta</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full"
            readOnly={formData.role === "student"}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Şifre</label>
          <Input
            type="text"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full"
            readOnly={formData.role === "student"}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-4">{error}</div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
        <Button type="submit" className="cyberpunk-button" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            "Kullanıcı Ekle"
          )}
        </Button>
      </div>
    </form>
  );
}
