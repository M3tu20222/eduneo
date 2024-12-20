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

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface BranchTeacher {
  teacher: Teacher;
  branch: string;
}

interface Class {
  _id: string;
  name: string;
  academicYear: string;
  classTeacher: Teacher;
  branchTeachers: BranchTeacher[];
  students: Teacher[];
  isActive: boolean;
}

export function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/admin/classes");
      if (!response.ok) {
        throw new Error("Sınıflar yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      setError("Sınıflar yüklenirken bir hata oluştu");
      console.error("Sınıfları yükleme hatası:", error);
    } finally {
      setLoading(false);
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
            <TableHead>Sınıf Adı</TableHead>
            <TableHead>Akademik Yıl</TableHead>
            <TableHead>Sınıf Öğretmeni</TableHead>
            <TableHead>Öğrenci Sayısı</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls._id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.academicYear}</TableCell>
              <TableCell>
                {`${cls.classTeacher.firstName} ${cls.classTeacher.lastName}`}
              </TableCell>
              <TableCell>{cls.students.length}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    cls.isActive
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {cls.isActive ? "Aktif" : "Pasif"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/admin/classes/${cls._id}/edit`)
                    }
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
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
