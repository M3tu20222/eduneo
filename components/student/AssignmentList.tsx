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
import { Button } from "@/components/ui/button";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "Tamamlandı" | "Bekliyor" | "Gecikti";
}

interface AssignmentListProps {
  userId: string;
}

export default function AssignmentList({ userId }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `/api/student/assignments?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Ödevler alınamadı");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Ödevler yüklenirken hata oluştu:", error);
        setError("Ödevler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ödevlerim</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Ders</TableHead>
              <TableHead>Teslim Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.course}</TableCell>
                <TableCell>
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{assignment.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Görüntüle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
