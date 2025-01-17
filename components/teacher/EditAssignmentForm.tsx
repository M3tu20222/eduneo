"use client";

import React, { useState, useEffect } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const EditAssignmentForm: React.FC<EditAssignmentFormProps> = ({
  assignment,
  courses,
  onUpdate,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: assignment.title,
    description: assignment.description,
    dueDate: new Date(assignment.dueDate),
    course: assignment.course._id,
    class: assignment.class._id,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        dueDate: date,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const updatedAssignment: Assignment = {
      ...assignment,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate.toISOString(),
      course: {
        _id: formData.course,
        name: courses.find((c) => c._id === formData.course)?.name || "",
      },
      class: {
        _id: formData.class,
        name: courses.find((c) => c._id === formData.course)?.class.name || "",
      },
    };
    onUpdate(updatedAssignment);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (formData.course) {
      const selectedCourse = courses.find(
        (course) => course._id === formData.course
      );
      if (selectedCourse && selectedCourse.class) {
        setFormData((prevData) => ({
          ...prevData,
          class: selectedCourse.class._id,
        }));
      }
    }
  }, [formData.course, courses]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-gray-800 border-neon-blue cyberpunk-border cyberpunk-glow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-neon-blue cyberpunk-text">
          Ödevi Düzenle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neon-pink"
            >
              Başlık
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full bg-gray-700 text-neon-blue border-neon-purple focus:border-neon-pink focus:ring-neon-pink"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neon-pink"
            >
              Açıklama
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full bg-gray-700 text-neon-blue border-neon-purple focus:border-neon-pink focus:ring-neon-pink"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-neon-pink"
            >
              Teslim Tarihi
            </label>
            <DatePicker date={formData.dueDate} setDate={handleDateChange} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="course"
              className="block text-sm font-medium text-neon-pink"
            >
              Ders
            </label>
            <Select
              name="course"
              value={formData.course}
              onValueChange={(value) => handleSelectChange("course", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full bg-gray-700 text-neon-blue border-neon-purple focus:border-neon-pink focus:ring-neon-pink">
                <SelectValue placeholder="Ders seçin" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="class"
              className="block text-sm font-medium text-neon-pink"
            >
              Sınıf
            </label>
            <Select
              name="class"
              value={formData.class}
              onValueChange={(value) => handleSelectChange("class", value)}
              disabled={isSubmitting || !formData.course}
            >
              <SelectTrigger className="w-full bg-gray-700 text-neon-blue border-neon-purple focus:border-neon-pink focus:ring-neon-pink">
                <SelectValue placeholder="Sınıf seçin" />
              </SelectTrigger>
              <SelectContent>
                {formData.course ? (
                  courses.find((course) => course._id === formData.course)
                    ?.class ? (
                    <SelectItem
                      value={
                        courses.find(
                          (course) => course._id === formData.course
                        )!.class._id
                      }
                    >
                      {
                        courses.find(
                          (course) => course._id === formData.course
                        )!.class.name
                      }
                    </SelectItem>
                  ) : (
                    <SelectItem value="no-class">
                      Bu dersin sınıfı yok
                    </SelectItem>
                  )
                ) : (
                  <SelectItem value="select-course">Önce ders seçin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-neon-green text-black font-bold hover:bg-neon-yellow focus:ring-neon-yellow"
            >
              {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAssignmentForm;
