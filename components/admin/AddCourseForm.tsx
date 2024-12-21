"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface Branch {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
}

export function AddCourseForm() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    branch: "",
    teacher: "",
    class: "",
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBranches();
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches");
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        throw new Error("Branşlar alınamadı");
      }
    } catch (error) {
      console.error("Branşları getirme hatası:", error);
      setError("Branşlar yüklenirken bir hata oluştu");
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/admin/teachers");
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      } else {
        throw new Error("Öğretmenler alınamadı");
      }
    } catch (error) {
      console.error("Öğretmenleri getirme hatası:", error);
      setError("Öğretmenler yüklenirken bir hata oluştu");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/admin/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        throw new Error("Sınıflar alınamadı");
      }
    } catch (error) {
      console.error("Sınıfları getirme hatası:", error);
      setError("Sınıflar yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ders eklenirken bir hata oluştu");
      }

      router.push("/admin/courses");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Ders Adı
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: Matematik"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="code">
            Ders Kodu
          </label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Örn: MAT101"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Açıklama
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Ders hakkında kısa bir açıklama"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="branch">
            Branş
          </label>
          <Select
            id="branch"
            value={formData.branch}
            onChange={(e) =>
              setFormData({ ...formData, branch: e.target.value })
            }
            required
          >
            <option value="">Branş seçin</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="teacher">
            Öğretmen
          </label>
          <Select
            id="teacher"
            value={formData.teacher}
            onChange={(e) =>
              setFormData({ ...formData, teacher: e.target.value })
            }
            required
          >
            <option value="">Öğretmen seçin</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="class">
            Sınıf
          </label>
          <Select
            id="class"
            value={formData.class}
            onChange={(e) =>
              setFormData({ ...formData, class: e.target.value })
            }
            required
          >
            <option value="">Sınıf seçin</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </Select>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end space-x-4 pt-4">
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
              "Ders Ekle"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
