"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Branch {
  _id: string;
  name: string;
  description: string;
}

export function EditBranchForm({ branchId }: { branchId: string }) {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchBranch = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/branches/${branchId}`);
      if (!response.ok) {
        throw new Error("Branş bilgileri alınamadı");
      }
      const data = await response.json();
      setBranch(data);
    } catch (error) {
      console.error("Branş bilgilerini getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Branş bilgileri yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/branches/${branchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branch),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Branş güncellenirken bir hata oluştu");
      }

      toast({
        title: "Başarılı",
        description: "Branş başarıyla güncellendi",
      });
      router.push("/admin/branches");
      router.refresh();
    } catch (error: any) {
      console.error("Branş güncelleme hatası:", error);
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

  if (!branch) {
    return <div className="text-center py-4">Branş bulunamadı</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Branş Adı
          </label>
          <Input
            id="name"
            value={branch.name}
            onChange={(e) => setBranch({ ...branch, name: e.target.value })}
            placeholder="Örn: Matematik"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Açıklama
          </label>
          <Textarea
            id="description"
            value={branch.description}
            onChange={(e) =>
              setBranch({ ...branch, description: e.target.value })
            }
            placeholder="Branş hakkında kısa bir açıklama"
            rows={3}
          />
        </div>

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
              "Branşı Güncelle"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
