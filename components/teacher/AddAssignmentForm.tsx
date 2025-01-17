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

export interface AddAssignmentFormProps {
  userId: string;
  courses: Course[];
  onAssignmentAdded: (newAssignment: Assignment) => void;
}

const AddAssignmentForm: React.FC<AddAssignmentFormProps> = ({
  userId,
  courses,
  onAssignmentAdded,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    course: "",
    class: "",
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

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          teacher: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Ödev eklenirken bir hata oluştu");
      }

      const newAssignment = await response.json();
      onAssignmentAdded(newAssignment);
      setFormData({
        title: "",
        description: "",
        dueDate: new Date(),
        course: "",
        class: "",
      });
    } catch (error) {
      console.error("Ödev ekleme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      } else {
        setFormData((prevData) => ({
          ...prevData,
          class: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        class: "",
      }));
    }
  }, [formData.course, courses]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-neon-blue cyberpunk-border cyberpunk-glow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-neon-blue cyberpunk-text">
          Yeni Ödev Ekle
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neon-green text-black font-bold hover:bg-neon-yellow focus:ring-neon-yellow"
          >
            {isSubmitting ? "Ekleniyor..." : "Ödev Ekle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAssignmentForm;
