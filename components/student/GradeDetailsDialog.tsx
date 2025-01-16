"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";

interface CourseGrade {
  course: string;
  teacherName: string;
  grades: {
    grade: number;
    date: string;
  }[];
}

interface GradeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseGrade;
}

export default function GradeDetailsDialog({
  isOpen,
  onClose,
  course,
}: GradeDetailsDialogProps) {
  const chartData = course.grades.map((grade) => ({
    date: grade.date,
    value: grade.grade,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{course.course} - Not Detayları</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>Öğretmen:</strong> {course.teacherName}
          </p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(isoString) =>
                    format(new Date(isoString), "dd/MM/yy")
                  }
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(isoString) =>
                    format(new Date(isoString), "dd/MM/yyyy")
                  }
                  formatter={(value) => [`${value}`, "Not"]}
                />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Not Geçmişi:</h4>
            <ul>
              {course.grades.map((grade, index) => (
                <li key={index}>
                  {format(new Date(grade.date), "dd/MM/yyyy")}: {grade.grade}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
