import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  pointValue: number;
}

interface AssignmentListProps {
  assignments: Assignment[];
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Başlık</TableHead>
          <TableHead>Açıklama</TableHead>
          <TableHead>Teslim Tarihi</TableHead>
          <TableHead>Ders</TableHead>
          <TableHead>Sınıf</TableHead>
          <TableHead>Puan Değeri</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment._id}>
            <TableCell>{assignment.title}</TableCell>
            <TableCell>{assignment.description}</TableCell>
            <TableCell>
              {new Date(assignment.dueDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{assignment.course.name}</TableCell>
            <TableCell>{assignment.class.name}</TableCell>
            <TableCell>{assignment.pointValue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssignmentList;
