'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'

interface Branch {
  _id: string
  name: string
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
}

interface Class {
  _id: string
  name: string
}

interface Course {
  _id: string
  name: string
  code: string
  description: string
  branch: string
  teacher: string
  class: string
}

export function EditCourseForm({ courseId }: { courseId: string }) {
  const [formData, setFormData] = useState<Course>({
    _id: '',
    name: '',
    code: '',
    description: '',
    branch: '',
    teacher: '',
    class: '',
  })
  const [branches, setBranches] = useState<Branch[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchCourseData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`)
      if (!response.ok) throw new Error('Ders bilgileri alınamadı')
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Ders bilgilerini getirme hatası:', error)
      setError('Ders bilgileri yüklenirken bir hata oluştu')
    }
  }, [courseId])

  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/branches')
      if (!response.ok) throw new Error('Branşlar alınamadı')
      const data = await response.json()
      setBranches(data)
    } catch (error) {
      console.error('Branşları getirme hatası:', error)
    }
  }, [])

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

  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (!response.ok) throw new Error('Sınıflar alınamadı')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Sınıfları getirme hatası:', error)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCourseData(),
        fetchBranches(),
        fetchTeachers(),
        fetchClasses()
      ])
      setLoading(false)
    }
    fetchData()
  }, [fetchCourseData, fetchBranches, fetchTeachers, fetchClasses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ders güncellenirken bir hata oluştu')
      }

      router.push('/admin/courses')
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
            Ders Adı
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: Matematik"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="code">
            Ders Kodu
          </label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Örn: MAT101"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Açıklama
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ders hakkında kısa bir açıklama"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="branch">
            Branş
          </label>
          <Select
            id="branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            required
          >
            <option value="">Branş seçin</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="teacher">
            Öğretmen
          </label>
          <Select
            id="teacher"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            required
          >
            <option value="">Öğretmen seçin</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {`${teacher.firstName} ${teacher.lastName}`}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="class">
            Sınıf
          </label>
          <Select
            id="class"
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            required
          >
            <option value="">Sınıf seçin</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
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
              'Dersi Güncelle'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

