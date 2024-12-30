'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface FormData {
  name: string
  academicYear: string
  classTeacher: string
  branchTeachers: Array<{
    teacher: string
    branch: string
  }>
  students: string[]
  isActive: boolean
}

export function AddClassForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    academicYear: new Date().getFullYear().toString(),
    classTeacher: '',
    branchTeachers: [],
    students: [],
    isActive: true
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers')
      if (!response.ok) throw new Error('Öğretmenler yüklenemedi')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Öğretmenleri yükleme hatası:', error)
      setError('Öğretmenler yüklenirken bir hata oluştu')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Sınıf eklenirken bir hata oluştu')
      }

      router.push('/admin/classes')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
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
            value={formData.classTeacher}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData({ ...formData, classTeacher: e.target.value })
            }
          >
            <option value="">Sınıf öğretmeni seçin</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {`${teacher.firstName} ${teacher.lastName}`}
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
                Kaydediliyor...
              </>
            ) : (
              'Sınıf Ekle'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

