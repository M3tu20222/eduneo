'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Student {
  _id: string
  name: string
  points: number
}

interface StudentPointListProps {
  courseId: string
}

export function StudentPointList({ courseId }: StudentPointListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/students?courseId=${courseId}`)
      if (!response.ok) {
        throw new Error('Öğrenciler alınamadı')
      }
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Öğrencileri yükleme hatası:', error)
      toast({
        title: "Hata",
        description: "Öğrenciler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const updatePoints = async (studentId: string, change: number) => {
    try {
      const response = await fetch('/api/teacher/student-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, courseId, change }),
      })

      if (!response.ok) {
        throw new Error('Puan güncellenemedi')
      }

      const updatedStudent = await response.json()
      setStudents(students.map(student => 
        student._id === updatedStudent._id ? updatedStudent : student
      ))

      toast({
        title: "Başarılı",
        description: "Öğrenci puanı güncellendi",
      })
    } catch (error) {
      console.error('Puan güncelleme hatası:', error)
      toast({
        title: "Hata",
        description: "Puan güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <ul className="space-y-4">
      {students.map((student) => (
        <li key={student._id} className="flex items-center justify-between">
          <span>{student.name} - Puan: {student.points}</span>
          <div>
            <Button onClick={() => updatePoints(student._id, 5)} className="mr-2">+</Button>
            <Button onClick={() => updatePoints(student._id, -5)} variant="destructive">-</Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

