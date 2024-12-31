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

interface Branch {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  branches: string[];
}

export function EditTeacherForm({ teacherId }: { teacherId: string }) {
  const [formData, setFormData] = useState<Teacher>({
    _id: "",
    name: "",
    email: "",
    branches: [],
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}`);
      if (!response.ok) throw new Error("Öğretmen bilgileri alınamadı");
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Öğretmen bilgilerini getirme hatası:", error);
      setError("Öğretmen bilgileri yüklenirken bir hata oluştu");
    }
  }, [teacherId]);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/branches");
      if (!response.ok) throw new Error("Branşlar alınamadı");
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Branşları getirme hatası:", error);
      setError("Branşlar yüklenirken bir hata oluştu");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTeacherData();
      await fetchBranches();
      setLoading(false);
    };
    fetchData();
  }, [fetchTeacherData, fetchBranches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Öğretmen güncellenirken bir hata oluştu"
        );
      }

      router.push("/admin/teachers");
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

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
          <label className="text-sm font-medium" htmlFor="branches">
            Branşlar
          </label>
          <Select
            value={formData.branches.length > 0 ? formData.branches[0] : ""}
            onValueChange={(value) => {
              const updatedBranches = formData.branches.includes(value)
                ? formData.branches.filter((branch) => branch !== value)
                : [...formData.branches, value];
              setFormData({ ...formData, branches: updatedBranches });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Branş seçin" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch._id} value={branch._id}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.branches.includes(branch._id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    {branch.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.branches.map((branchId) => {
              const branch = branches.find((b) => b._id === branchId);
              return branch ? (
                <span
                  key={branch._id}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {branch.name}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        branches: formData.branches.filter(
                          (id) => id !== branch._id
                        ),
                      });
                    }}
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                  >
                    <span className="sr-only">Remove {branch.name}</span>
                    &#10005;
                  </button>
                </span>
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
                Güncelleniyor...
              </>
            ) : (
              "Öğretmeni Güncelle"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
