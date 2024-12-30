'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from 'lucide-react'

interface Course {
  _id: string
  name: string
  code: string
  branch: {
    name: string
  }
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  }
  class: {
    name: string
  }
}

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
}

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses')
      if (!response.ok) {
        throw new Error('Dersler yüklenirken bir hata oluştu')
      }
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      setError('Dersler yüklenirken bir hata oluştu')
      console.error('Dersleri yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/courses/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Ders silinirken bir hata oluştu')
        }
        fetchCourses() // Listeyi yenile
      } catch (error) {
        console.error('Ders silme hatası:', error)
        setError('Ders silinirken bir hata oluştu')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-4">Yükleniyor...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="bg-card rounded-lg cyberpunk-border cyberpunk-glow p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ders Adı</TableHead>
            <TableHead>Ders Kodu</TableHead>
            <TableHead>Branş</TableHead>
            <TableHead>Öğretmen</TableHead>
            <TableHead>Sınıf</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.branch.name}</TableCell>
              <TableCell>
                {course.teacher ? 
                  `${course.teacher.firstName} ${course.teacher.lastName}` : 
                  'Atanmamış'}
              </TableCell>
              <TableCell>{course.class.name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/courses/${course._id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(course._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

