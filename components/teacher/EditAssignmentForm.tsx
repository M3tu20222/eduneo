"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Course {
  _id: string;
  name: string;
  code: string;
  branch: {
    _id: string;
    name: string;
  };
  class: {
    _id: string;
    name: string;
  };
}

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

interface EditAssignmentFormProps {
  assignment: Assignment;
  courses: Course[];
  onUpdate: (updatedAssignment: Assignment) => void;
  onCancel: () => void;
}

export default function EditAssignmentForm({
  assignment,
  courses,
  onUpdate,
  onCancel,
}: EditAssignmentFormProps) {
  const [formData, setFormData] = useState({
    ...assignment,
    dueDate: new Date(assignment.dueDate).toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ödevi Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Ödev Başlığı
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Ödev Açıklaması
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Teslim Tarihi
            </label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="course" className="text-sm font-medium">
              Ders
            </label>
            <Select
              value={formData.course._id}
              onValueChange={(value) => {
                const selectedCourse = courses.find((c) => c._id === value);
                if (selectedCourse) {
                  setFormData({
                    ...formData,
                    course: {
                      _id: selectedCourse._id,
                      name: selectedCourse.name,
                    },
                    class: {
                      _id: selectedCourse.class._id,
                      name: selectedCourse.class.name,
                    },
                  });
                }
              }}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Ders Seçin" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {`${course.name} (${course.code}) - ${course.class.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
            <Button type="submit">Güncelle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
