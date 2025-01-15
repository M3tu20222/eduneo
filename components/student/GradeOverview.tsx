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

interface Grade {
  course: string;
  grade: number;
}

interface GradeOverviewProps {
  userId: string;
}

export default function GradeOverview({ userId }: GradeOverviewProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`/api/student/grades?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Notlar alınamadı");
        }
        const data = await response.json();
        setGrades(data);
      } catch (error) {
        console.error("Notlar yüklenirken hata oluştu:", error);
        setError("Notlar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [userId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  const averageGrade =
    grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Not Özeti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <strong>Genel Ortalama:</strong> {averageGrade.toFixed(2)}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ders</TableHead>
              <TableHead>Not</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade, index) => (
              <TableRow key={index}>
                <TableCell>{grade.course}</TableCell>
                <TableCell>{grade.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
