"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users } from "lucide-react";

interface Course {
  _id: string;
  name: string;
  code: string;
  branch: {
    name: string;
  };
  class: {
    name: string;
  };
}

interface TeacherCoursesListProps {
  userId: string;
}

export function TeacherCoursesList({ userId }: TeacherCoursesListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/teacher/courses?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Dersler alınamadı");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Dersler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (courses.length === 0) {
    return <div>Henüz ders atanmamış.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course._id} className="cyberpunk-border cyberpunk-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              {course.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Ders Kodu:</strong> {course.code}
            </p>
            <p>
              <strong>Branş:</strong> {course.branch.name}
            </p>
            <p>
              <strong>Sınıf:</strong> {course.class.name}
            </p>
            <Button className="mt-4 w-full cyberpunk-button">
              <Users className="mr-2" />
              Öğrencileri Görüntüle
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
