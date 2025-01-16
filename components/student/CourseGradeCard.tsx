"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GradeDetailsDialog from "./GradeDetailsDialog";

interface CourseGrade {
  course: string;
  teacherName: string;
  grades: {
    grade: number;
    date: string;
  }[];
}

interface CourseGradeCardProps {
  course: CourseGrade;
}

export default function CourseGradeCard({ course }: CourseGradeCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log("Course data:", course);

  const averageGrade =
    course.grades.length > 0
      ? course.grades.reduce((sum, grade) => sum + grade.grade, 0) /
        course.grades.length
      : null;

  console.log("Calculated average grade for course:", averageGrade);

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle>{course.course}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Öğretmen:</strong> {course.teacherName}
          </p>
          <p>
            <strong>Ortalama Not:</strong>{" "}
            {averageGrade !== null
              ? averageGrade.toFixed(2)
              : "Henüz not girilmemiş"}
          </p>
          <p>
            <strong>Not Sayısı:</strong> {course.grades.length}
          </p>
          <Button
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
          >
            Detayları Gör
          </Button>
        </CardContent>
      </Card>
      <GradeDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        course={course}
      />
    </>
  );
}
