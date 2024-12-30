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

interface Branch {
  _id: string
  name: string
}

interface Teacher {
  _id: string
  name: string
  email: string
  branches: Branch[]
  classes: string[]
}

export function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers')
      if (!response.ok) {
        throw new Error('Öğretmenler yüklenirken bir hata oluştu')
      }
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      setError('Öğretmenler yüklenirken bir hata oluştu')
      console.error('Öğretmenleri yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/teachers/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Öğretmen silinirken bir hata oluştu')
        }
        fetchTeachers() // Listeyi yenile
      } catch (error) {
        console.error('Öğretmen silme hatası:', error)
        setError('Öğretmen silinirken bir hata oluştu')
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
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Branşlar</TableHead>
            <TableHead>Sınıflar</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher._id}>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.branches.map(b => b.name).join(', ')}</TableCell>
              <TableCell>{teacher.classes.join(', ')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/teachers/${teacher._id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(teacher._id)}
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

