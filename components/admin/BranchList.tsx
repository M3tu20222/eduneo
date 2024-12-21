"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Branch {
  _id: string;
  name: string;
  description: string;
}

export function BranchList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches");
      if (!response.ok) {
        throw new Error("Branşlar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      setError("Branşlar yüklenirken bir hata oluştu");
      console.error("Branşları yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu branşı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/branches/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Branş silinirken bir hata oluştu");
        }
        fetchBranches(); // Listeyi yenile
      } catch (error) {
        console.error("Branş silme hatası:", error);
        setError("Branş silinirken bir hata oluştu");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branş Adı</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch._id}>
              <TableCell>{branch.name}</TableCell>
              <TableCell>{branch.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/branches/${branch._id}/edit`)
                    }
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(branch._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
