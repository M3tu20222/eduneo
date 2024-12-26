"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ClipboardList, Plus, Edit, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  course: {
    _id: string;
    name: string;
  };
  class: {
    _id: string;
    name: string;
  };
}

interface Course {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
}

interface TeacherAssignmentsListProps {
  userId: string;
}

export function TeacherAssignmentsList({
  userId,
}: TeacherAssignmentsListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    course: "",
    class: "",
  });

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/assignments?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Ödevler alınamadı");
      }
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Ödevler yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Ödevler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/courses?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Dersler alınamadı");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Dersler yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Dersler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/classes?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Sınıflar alınamadı");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Sınıflar yüklenirken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Sınıflar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId]);

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
    fetchClasses();
  }, [fetchAssignments, fetchCourses, fetchClasses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, teacher: userId }),
      });
      if (!response.ok) {
        throw new Error("Ödev eklenemedi");
      }
      const newAssignment = await response.json();
      setAssignments([...assignments, newAssignment]);
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        course: "",
        class: "",
      });
      toast({
        title: "Başarılı",
        description: "Ödev başarıyla eklendi",
      });
    } catch (error) {
      console.error("Ödev ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödev eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <Button
        className="mb-6 cyberpunk-button"
        onClick={() => setShowForm(!showForm)}
      >
        <Plus className="mr-2" />
        {showForm ? "Formu Gizle" : "Yeni Ödev Ekle"}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <Input
            placeholder="Ödev Başlığı"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <Textarea
            placeholder="Ödev Açıklaması"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
          <Select
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
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
            value={formData.class}
            onChange={(e) =>
              setFormData({ ...formData, class: e.target.value })
            }
            required
          >
            <option value="">Sınıf Seçin</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </Select>
          <Button type="submit" className="cyberpunk-button">
            Ödev Ekle
          </Button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="cyberpunk-border cyberpunk-glow"
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2" />
                {assignment.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Ders:</strong> {assignment.course.name}
              </p>
              <p>
                <strong>Sınıf:</strong> {assignment.class.name}
              </p>
              <p>
                <strong>Teslim Tarihi:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString("tr-TR")}
              </p>
              <p className="mt-2">{assignment.description}</p>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
