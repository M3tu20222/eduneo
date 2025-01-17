"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

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
  }, [userId, toast]);

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
  }, [userId, toast]);

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
    toast({
      title: "Başarılı",
      description: "Yeni ödev başarıyla eklendi",
      variant: "default",
    });
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
    return (
      <div className="text-center text-2xl font-bold text-neon-blue animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-2xl font-bold text-neon-pink">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-blue cyberpunk-text">
        Ödev Yönetimi
      </h1>

      <Button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-6 bg-neon-green text-black font-bold hover:bg-neon-yellow hover:text-black transition-all duration-300 cyberpunk-button"
      >
        <Plus className="mr-2 h-5 w-5" /> Yeni Ödev Ekle
      </Button>

      {showAddForm && courses.length > 0 && (
        <Card className="mb-8 bg-gray-800 border-neon-blue cyberpunk-border">
          <CardHeader>
            <CardTitle className="text-neon-yellow">Yeni Ödev Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <AddAssignmentForm
              userId={userId}
              courses={courses}
              onAssignmentAdded={handleAssignmentAdded}
            />
          </CardContent>
        </Card>
      )}

      {courses.length === 0 && (
        <div className="mb-4 text-neon-pink font-bold">
          Henüz hiç ders eklenmemiş. Lütfen önce ders ekleyin.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="bg-gray-800 border-neon-blue hover:border-neon-yellow transition-all duration-300 cyberpunk-border cyberpunk-glow"
          >
            <CardHeader>
              <CardTitle className="flex items-center text-neon-yellow">
                <ClipboardList className="mr-2 h-5 w-5" />
                {assignment.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-2">
                <strong className="text-neon-pink">Açıklama:</strong>{" "}
                {assignment.description}
              </p>
              <p className="mb-2">
                <strong className="text-neon-pink">Teslim Tarihi:</strong>{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <p className="mb-2">
                <strong className="text-neon-pink">Ders:</strong>{" "}
                {assignment.course.name}
              </p>
              <p className="mb-4">
                <strong className="text-neon-pink">Sınıf:</strong>{" "}
                {assignment.class.name}
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAssignment(assignment)}
                  className="bg-neon-blue text-black hover:bg-neon-yellow hover:text-black transition-all duration-300"
                >
                  <Edit className="mr-2 h-4 w-4" /> Düzenle
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingAssignment(assignment)}
                  className="bg-neon-pink text-black hover:bg-neon-red hover:text-black transition-all duration-300"
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
        <AlertDialogContent className="bg-gray-800 border-neon-pink cyberpunk-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neon-yellow">
              Ödevi Sil
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Bu ödevi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 text-white hover:bg-gray-700">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAssignment}
              className="bg-neon-red text-black hover:bg-neon-pink"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
