'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface Teacher {
  _id: string
  firstName: string
  lastName: string
}

interface Course {
  _id: string
  name: string
  code: string
  branch: {
    name: string
  }
}

interface Class {
  _id: string
  name: string
  academicYear: string
  classTeacher: string
  courses: string[]
  students: string[]
}

export function EditClassForm({ classId }: { classId: string }) {
  const [formData, setFormData] = useState<Class>({
    _id: '',
    name: '',
    academicYear: '',
    classTeacher: '',
    courses: [],
    students: [],
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchClassData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/classes/${classId}`)
      if (!response.ok) throw new Error('Sınıf bilgileri alınamadı')
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Sınıf bilgilerini getirme hatası:', error)
      setError('Sınıf bilgileri yüklenirken bir hata oluştu')
    }
  }, [classId])

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/teachers')
      if (!response.ok) throw new Error('Öğretmenler alınamadı')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Öğretmenleri getirme hatası:', error)
    }
  }, [])

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/courses");
      if (!response.ok) throw new Error("Dersler alınamadı");
      const data = await response.json() as Course[];
      // Dersleri benzersiz yap
      const uniqueCourses = Array.from(
        new Map(data.map((course: Course) => [course._id, course])).values()
      );
      setCourses(uniqueCourses as Course[]);
    } catch (error) {
      console.error("Dersleri getirme hatası:", error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/students')
      if (!response.ok) throw new Error('Öğrenciler alınamadı')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Öğrencileri getirme hatası:', error)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchClassData(),
        fetchTeachers(),
        fetchCourses(),
        fetchStudents()
      ])
      setLoading(false)
    }
    fetchData()
  }, [fetchClassData, fetchTeachers, fetchCourses, fetchStudents])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Sınıf güncellenirken bir hata oluştu')
      }

      router.push('/admin/classes')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Sınıf Adı
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: 9-A"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="academicYear">
            Akademik Yıl
          </label>
          <Input
            id="academicYear"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            placeholder="2023-2024"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="classTeacher">
            Sınıf Öğretmeni
          </label>
          <Select
            id="classTeacher"
            value={formData.classTeacher}
            onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
            required
          >
            <option value="">Sınıf öğretmeni seçin</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {`${teacher.firstName} ${teacher.lastName}`}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="courses">
            Dersler
          </label>
          <Select
            id="courses"
            multiple
            value={formData.courses}
            onChange={(e) => setFormData({ 
              ...formData, 
              courses: Array.from(new Set(Array.from(e.target.selectedOptions, option => option.value)))
            })}
          >
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {`${course.name} (${course.code}) - ${course.branch.name}`}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="students">
            Öğrenciler
          </label>
          <Select
            id="students"
            multiple
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: Array.from(e.target.selectedOptions, option => option.value) })}
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {`${student.firstName} ${student.lastName}`}
              </option>
            ))}
          </Select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            İptal
          </Button>
          <Button
            type="submit"
            className="cyberpunk-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              'Sınıfı Güncelle'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

