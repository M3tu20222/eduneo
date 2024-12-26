"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
        onChange={(e) => setFormData({ ...formData, student: e.target.value })}
        required
      >
        <option value="">Öğrenci Seçin</option>
        {students.map((student) => (
          <option key={student._id} value={student._id}>
            {student.name}
          </option>
        ))}
      </Select>

      <Select
        value={formData.course}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        required
      >
        <option value="">Ders Seçin</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.name}
          </option>
        ))}
      </Select>

      <Select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        required
      >
        <option value="">Not Türü Seçin</option>
        <option value="exam">Sınav</option>
        <option value="homework">Ödev</option>
        <option value="project">Proje</option>
        <option value="other">Diğer</option>
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
