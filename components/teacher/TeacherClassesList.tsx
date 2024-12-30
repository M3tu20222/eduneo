'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ClipboardList } from 'lucide-react'

interface Class {
  _id: string
  name: string
  academicYear: string
  studentCount: number
}

interface TeacherClassesListProps {
  userId: string
}

export function TeacherClassesList({ userId }: TeacherClassesListProps) {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`/api/teacher/classes?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Sınıflar alınamadı')
        }
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Sınıflar yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [userId])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  if (classes.length === 0) {
    return <div>Henüz sınıf atanmamış.</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls) => (
        <Card key={cls._id} className="cyberpunk-border cyberpunk-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              {cls.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Akademik Yıl:</strong> {cls.academicYear}</p>
            <p><strong>Öğrenci Sayısı:</strong> {cls.studentCount}</p>
            <Button className="mt-4 w-full cyberpunk-button">
              <ClipboardList className="mr-2" />
              Sınıf Detayları
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

