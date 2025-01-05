"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Edit, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AddAssignmentForm from "./AddAssignmentForm";
import EditAssignmentForm from "./EditAssignmentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface TeacherAssignmentsListProps {
  userId: string;
}

export default function TeacherAssignmentsList({
  userId,
}: TeacherAssignmentsListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/assignments?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Ödevler alınamadı");
      }
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Ödevler yüklenirken hata oluştu:", error);
      setError("Ödevler yüklenirken bir hata oluştu");
      toast({
        title: "Hata",
        description: "Ödevler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/courses?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Dersler alınamadı");
      }
      const data = await response.json();
      const formattedCourses = data.map((course: any) => ({
        _id: course._id || course.id,
        name: course.name,
        code: course.code,
        branch: course.branch,
        class: course.class,
      }));
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Dersler yüklenirken hata oluştu:", error);
      setError("Dersler yüklenirken bir hata oluştu");
      toast({
        title: "Hata",
        description: "Dersler yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchAssignments(), fetchCourses()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchAssignments, fetchCourses]);

  const handleAssignmentAdded = (newAssignment: Assignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
    setShowAddForm(false);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
  };

  const handleUpdateAssignment = async (updatedAssignment: Assignment) => {
    try {
      const response = await fetch(
        `/api/teacher/assignments/${updatedAssignment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAssignment),
        }
      );

      if (!response.ok) {
        throw new Error("Ödev güncellenirken bir hata oluştu");
      }

      const updatedData = await response.json();
      setAssignments(
        assignments.map((a) => (a._id === updatedData._id ? updatedData : a))
      );
      setEditingAssignment(null);
      toast({
        title: "Başarılı",
        description: "Ödev başarıyla güncellendi",
      });
    } catch (error) {
      console.error("Ödev güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödev güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deletingAssignment) return;

    try {
      const response = await fetch(
        `/api/teacher/assignments/${deletingAssignment._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Ödev silinirken bir hata oluştu");
      }

      setAssignments(
        assignments.filter((a) => a._id !== deletingAssignment._id)
      );
      setDeletingAssignment(null);
      toast({
        title: "Başarılı",
        description: "Ödev başarıyla silindi",
      });
    } catch (error) {
      console.error("Ödev silme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödev silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div>
      <Button onClick={() => setShowAddForm(!showAddForm)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Yeni Ödev Ekle
      </Button>

      {showAddForm && courses.length > 0 && (
        <AddAssignmentForm
          userId={userId}
          courses={courses}
          onAssignmentAdded={handleAssignmentAdded}
        />
      )}

      {courses.length === 0 && (
        <div className="mb-4 text-red-500">
          Henüz hiç ders eklenmemiş. Lütfen önce ders ekleyin.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment._id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2" />
                {assignment.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Açıklama:</strong> {assignment.description}
              </p>
              <p>
                <strong>Teslim Tarihi:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Ders:</strong> {assignment.course.name}
              </p>
              <p>
                <strong>Sınıf:</strong> {assignment.class.name}
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAssignment(assignment)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Düzenle
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingAssignment(assignment)}
                >
                  <Trash className="mr-2 h-4 w-4" /> Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingAssignment && (
        <EditAssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onUpdate={handleUpdateAssignment}
          onCancel={() => setEditingAssignment(null)}
        />
      )}

      <AlertDialog
        open={!!deletingAssignment}
        onOpenChange={() => setDeletingAssignment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ödevi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ödevi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssignment}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
