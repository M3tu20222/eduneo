"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Course {
  _id: string;
  name: string;
  code: string;
  teacher: string;
}

interface CourseListProps {
  userId: string;
}

export default function CourseList({ userId }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        if (!userId) {
          throw new Error("User ID is missing");
        }
        const response = await fetch(`/api/student/courses?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Dersler yüklenirken hata oluştu:", error);
        setError("Dersler yüklenirken bir hata oluştu");
        toast({
          variant: "destructive",
          title: "Hata",
          description:
            "Dersler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId, toast]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Derslerim</CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <p>Henüz kayıtlı ders bulunmamaktadır.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ders Kodu</TableHead>
                <TableHead>Ders Adı</TableHead>
                <TableHead>Öğretmen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
