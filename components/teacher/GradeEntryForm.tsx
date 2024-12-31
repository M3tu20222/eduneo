"use client";

import { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";

interface GradeEntryFormProps {
  courses: { _id: string; name: string }[];
  students: { _id: string; name: string }[];
}

export function GradeEntryForm({ courses, students }: GradeEntryFormProps) {
  const [formData, setFormData] = useState({
    student: "",
    course: "",
    type: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Not girişi başarısız oldu");
      }

      toast({
        title: "Başarılı",
        description: "Not başarıyla girildi",
      });
      router.refresh();
    } catch (error) {
      console.error("Not girişi hatası:", error);
      toast({
        title: "Hata",
        description: "Not girişi sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={formData.student}
        onValueChange={(value) => setFormData({ ...formData, student: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Öğrenci Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Öğrenci Seçin</SelectItem>
          {students.map((student) => (
            <SelectItem key={student._id} value={student._id}>
              {student.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.course}
        onValueChange={(value) => setFormData({ ...formData, course: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Ders Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Ders Seçin</SelectItem>
          {courses.map((course) => (
            <SelectItem key={course._id} value={course._id}>
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={formData.type}
        onValueChange={(value) => setFormData({ ...formData, type: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Not Türü Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Not Türü Seçin</SelectItem>
          <SelectItem value="exam">Sınav</SelectItem>
          <SelectItem value="homework">Ödev</SelectItem>
          <SelectItem value="project">Proje</SelectItem>
          <SelectItem value="other">Diğer</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        placeholder="Not Değeri"
        required
        min="0"
        max="100"
      />

      <Input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Notu Kaydet"}
      </Button>
    </form>
  );
}
