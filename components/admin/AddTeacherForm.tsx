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
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Branch {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
}

export function AddTeacherForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branches: [] as string[],
    classes: [] as string[],
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBranches();
    fetchClasses();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches");
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      }
    } catch (error) {
      console.error("Branşları getirme hatası:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/admin/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error("Sınıfları getirme hatası:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Öğretmen eklenirken bir hata oluştu");
      }

      router.push("/admin/teachers");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId: string) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter((id) => id !== branchId)
        : [...prev.branches, branchId],
    }));
  };

  const handleClassChange = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter((id) => id !== classId)
        : [...prev.classes, classId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Ad Soyad
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: Ahmet Yılmaz"
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
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Şifre
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Branşlar</label>
          <Select onValueChange={handleBranchChange}>
            <SelectTrigger>
              <SelectValue placeholder="Branş seçin" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch._id} value={branch._id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.branches.map((branchId) => {
              const branch = branches.find((b) => b._id === branchId);
              return branch ? (
                <Badge
                  key={branch._id}
                  variant="secondary"
                  className="px-2 py-1"
                >
                  {branch.name}
                  <button
                    type="button"
                    onClick={() => handleBranchChange(branch._id)}
                    className="ml-2 text-xs"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sınıflar</label>
          <Select onValueChange={handleClassChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sınıf seçin" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.classes.map((classId) => {
              const cls = classes.find((c) => c._id === classId);
              return cls ? (
                <Badge key={cls._id} variant="secondary" className="px-2 py-1">
                  {cls.name}
                  <button
                    type="button"
                    onClick={() => handleClassChange(cls._id)}
                    className="ml-2 text-xs"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
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
              "Öğretmen Ekle"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
