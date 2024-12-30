"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface Student {
  _id: string;
  number: string;
  name: string;
  class: string;
  scores: { value: number; date: string }[];
}

interface GradeEntrySystemProps {
  teacherId: string;
  courseId: string;
}

export function GradeEntrySystem({
  teacherId,
  courseId,
}: GradeEntrySystemProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  // Remove this line
  // const [selectedClass, setSelectedClass] = useState<string>("All")

  const fetchStudents = useCallback(async () => {
    console.log(
      "Fetching students for teacherId:",
      teacherId,
      "and courseId:",
      courseId
    );
    try {
      const response = await fetch(
        `/api/teacher/students?teacherId=${teacherId}&courseId=${courseId}`
      );
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      console.log("Fetched student data:", data);
      if (data.length > 0) {
        console.log("Class:", data[0].class);
      }
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [teacherId, courseId]);

  useEffect(() => {
    console.log("Component mounted, calling fetchStudents");
    fetchStudents();
  }, [fetchStudents]);

  const handleScoreChange = (
    studentId: string,
    index: number,
    value: string
  ) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId
          ? {
              ...student,
              scores: [
                ...student.scores.slice(0, index),
                { ...student.scores[index], value: numericValue },
                ...student.scores.slice(index + 1),
              ],
            }
          : student
      )
    );
  };

  const saveScore = async (studentId: string, index: number) => {
    const student = students.find((s) => s._id === studentId);
    if (!student) return;

    const score = student.scores[index];
    try {
      const response = await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseId,
          value: score.value,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save score");

      toast({
        title: "Success",
        description: "Score saved successfully",
      });
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error",
        description: "Failed to save score. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateAvgScore = (scores: { value: number }[]): number => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score.value, 0);
    return Math.round(sum / scores.length);
  };

  // Replace this line
  // const filteredStudents = selectedClass === "All"
  //   ? students
  //   : students.filter(student => student.class === selectedClass)

  // With this line
  const filteredStudents = students;

  console.log(
    "Rendering GradeEntrySystem. Students:",
    students,
    "Loading:",
    loading
  );
  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Grade Entry System</h2>
        {students.length > 0 && (
          <p className="text-lg">Class: {students[0].class}</p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead>Scores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.number}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{calculateAvgScore(student.scores)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={student.scores[index]?.value || ""}
                        onChange={(e) =>
                          handleScoreChange(student._id, index, e.target.value)
                        }
                        className="w-16"
                        min={0}
                        max={100}
                      />
                      <Button
                        onClick={() => saveScore(student._id, index)}
                        size="sm"
                        variant="outline"
                      >
                        Save
                      </Button>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
