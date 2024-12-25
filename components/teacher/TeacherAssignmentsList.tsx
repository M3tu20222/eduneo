'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Plus, Edit, Trash } from 'lucide-react'

interface Assignment {
  _id: string
  title: string
  description: string
  dueDate: string
  course: {
    name: string
  }
  class: {
    name: string
  }
}

interface TeacherAssignmentsListProps {
  userId: string
}

export function TeacherAssignmentsList({ userId }: TeacherAssignmentsListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/api/teacher/assignments?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Ödevler alınamadı')
        }
        const data = await response.json()
        setAssignments(data)
      } catch (error) {
        console.error('Ödevler yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [userId])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div>
      <Button className="mb-6 cyberpunk-button">
        <Plus className="mr-2" />
        Yeni Ödev Ekle
      </Button>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment._id} className="cyberpunk-border cyberpunk-glow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="mr-2" />
                {assignment.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Ders:</strong> {assignment.course.name}</p>
              <p><strong>Sınıf:</strong> {assignment.class.name}</p>
              <p><strong>Teslim Tarihi:</strong> {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}</p>
              <p className="mt-2">{assignment.description}</p>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </Button>
                <Button variant="outline" size="sm" className="Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

