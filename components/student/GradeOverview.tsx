"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Grade {
  _id: string;
  value: number;
  date: string;
}

interface CourseGrades {
  courseId: string;
  courseName: string;
  teacherName: string;
  grades: Grade[];
}

interface GradeOverviewProps {
  userId: string;
}

export default function GradeOverview({ userId }: GradeOverviewProps) {
  const [grades, setGrades] = useState<CourseGrades[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseGrades | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(`/api/student/grades`);
        if (!response.ok) {
          throw new Error("Notlar alınamadı");
        }
        const data = await response.json();
        setGrades(data);
      } catch (error) {
        console.error("Notlar yüklenirken hata oluştu:", error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Notlar yüklenirken bir hata oluştu",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [toast]);

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold text-neon-blue animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return sum / grades.length;
  };

  const overallAverage =
    grades.reduce((acc, course) => acc + calculateAverage(course.grades), 0) /
    grades.length;

  return (
    <div className="p-8 bg-gray-900 text-neon-blue">
      <h1 className="text-4xl font-bold mb-6 cyberpunk-text text-center">
        Not Özeti
      </h1>
      <div className="mb-6 text-center">
        <strong className="text-neon-pink">Genel Ortalama:</strong>{" "}
        <span className="text-neon-green text-2xl">
          {isNaN(overallAverage)
            ? "Henüz not girilmemiş"
            : overallAverage.toFixed(2)}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((course) => (
          <div
            key={course.courseId}
            className="p-6 bg-gray-800 rounded-lg cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setSelectedCourse(course)}
          >
            <h2 className="text-xl font-semibold mb-4 text-neon-yellow">
              {course.courseName}
            </h2>
            <p>
              <strong className="text-neon-pink">Öğretmen:</strong>{" "}
              <span className="text-neon-blue">{course.teacherName}</span>
            </p>
            <p>
              <strong className="text-neon-pink">Ortalama Not:</strong>{" "}
              <span className="text-neon-green">
                {isNaN(calculateAverage(course.grades))
                  ? "Henüz not girilmemiş"
                  : calculateAverage(course.grades).toFixed(2)}
              </span>
            </p>
            <Button
              className="mt-4 bg-neon-purple hover:bg-neon-pink text-black font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCourse(course);
              }}
            >
              Detayları Gör
            </Button>
          </div>
        ))}
      </div>
      <Dialog
        open={!!selectedCourse}
        onOpenChange={() => setSelectedCourse(null)}
      >
        <DialogContent className="max-w-3xl bg-gray-900 text-neon-blue cyberpunk-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-neon-yellow">
              {selectedCourse?.courseName} - Not Detayları
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              <strong className="text-neon-pink">Öğretmen:</strong>{" "}
              <span className="text-neon-blue">
                {selectedCourse?.teacherName}
              </span>
            </p>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={selectedCourse?.grades.map((grade) => ({
                    date: format(new Date(grade.date), "dd/MM/yy"),
                    value: grade.value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#00ffff" />
                  <YAxis domain={[0, 100]} stroke="#00ffff" />
                  <Tooltip
                    labelFormatter={(value) => `Tarih: ${value}`}
                    formatter={(value) => [`Not: ${value}`, "Değer"]}
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #00ffff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff00ff"
                    name="Not"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-neon-yellow">
                Not Geçmişi:
              </h4>
              <ul className="space-y-2">
                {selectedCourse?.grades.map((grade) => (
                  <li key={grade._id} className="cyberpunk-border p-2 rounded">
                    <span className="text-neon-pink">
                      {format(new Date(grade.date), "dd/MM/yyyy")}:
                    </span>{" "}
                    <span className="text-neon-green">{grade.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
