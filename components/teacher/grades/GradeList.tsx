"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeEntryModal } from "./GradeEntryModal";
import { calculateAverage } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  number: string;
  name: string;
  class: string;
  grades: {
    id: string;
    value: number;
    type: string;
    date: string;
  }[];
}

interface Class {
  id: string;
  name: string;
  academicYear: string;
}

interface Course {
  id: string;
  name: string;
}

export function GradeList({ teacherId }: { teacherId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/teacher/courses?userId=${teacherId}&classId=${selectedClass}`
      );
      if (!response.ok) {
        throw new Error("Dersler alınamadı");
      }
      const data = await response.json();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0].id);
      }
    } catch (error) {
      console.error("Dersler yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Dersler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [teacherId, selectedClass]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      const response = await fetch(
        `/api/teacher/students?classId=${selectedClass}&courseId=${selectedCourse}`
      );
      if (!response.ok) {
        throw new Error("Öğrenciler alınamadı");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Öğrenciler yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Öğrenciler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedClass, selectedCourse]);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teacher/classes?userId=${teacherId}`);
      if (!response.ok) {
        throw new Error("Sınıflar alınamadı");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setClasses(data);
        setSelectedClass(data[0].id);
      } else {
        toast({
          title: "Bilgi",
          description: "Atanmış sınıf bulunamadı.",
        });
      }
    } catch (error) {
      console.error("Sınıflar yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Sınıflar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (selectedClass) {
      fetchCourses();
    }
  }, [selectedClass, fetchCourses]);

  useEffect(() => {
    if (selectedClass && selectedCourse) {
      fetchStudents();
    }
  }, [selectedClass, selectedCourse, fetchStudents]);

  const handleGradeSubmit = async (grade: number) => {
    if (!selectedStudent || !selectedCourse) return;

    try {
      const response = await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          classId: selectedClass,
          courseId: selectedCourse,
          value: grade,
          type: "exam",
        }),
      });

      if (!response.ok) throw new Error("Not kaydedilemedi");

      toast({
        title: "Başarılı",
        description: "Not başarıyla kaydedildi",
      });

      await fetchStudents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Not kaydetme hatası:", error);
      toast({
        title: "Hata",
        description: "Not kaydedilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (classes.length === 0) {
    return <div className="text-center py-8">Atanmış sınıf bulunamadı.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sınıf Seçin" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ders Seçin" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        {loadingStudents ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numara</TableHead>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Sınıf</TableHead>
                <TableHead>Ortalama</TableHead>
                <TableHead>Notlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.number}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{calculateAverage(student.grades)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {student.grades.map((grade) => (
                        <span
                          key={grade.id}
                          className="inline-flex items-center justify-center w-auto px-2 h-6 text-sm rounded bg-secondary"
                          title={`Tarih: ${new Date(
                            grade.date
                          ).toLocaleDateString("tr-TR")}, Tür: ${grade.type}`}
                        >
                          {grade.value}
                        </span>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsModalOpen(true);
                        }}
                        className="w-10 h-6 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <GradeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGradeSubmit}
        studentName={selectedStudent?.name}
      />
    </div>
  );
}
