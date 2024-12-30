'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface Branch {
  _id: string
  name: string
}

interface Teacher {
  _id: string
  name: string
  email: string
  branches: string[]
}

export function EditTeacherForm({ teacherId }: { teacherId: string }) {
  const [formData, setFormData] = useState<Teacher>({
    _id: '',
    name: '',
    email: '',
    branches: [],
  })
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchTeacherData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}`)
      if (!response.ok) throw new Error('Öğretmen bilgileri alınamadı')
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Öğretmen bilgilerini getirme hatası:', error)
      setError('Öğretmen bilgileri yüklenirken bir hata oluştu')
    }
  }, [teacherId])

  const fetchBranches = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/branches')
      if (!response.ok) throw new Error('Branşlar alınamadı')
      const data = await response.json()
      setBranches(data)
    } catch (error) {
      console.error('Branşları getirme hatası:', error)
      setError('Branşlar yüklenirken bir hata oluştu')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchTeacherData()
      await fetchBranches()
      setLoading(false)
    }
    fetchData()
  }, [fetchTeacherData, fetchBranches])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Öğretmen güncellenirken bir hata oluştu')
      }

      router.push('/admin/teachers')
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
            Ad Soyad
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: Ahmet Yılmaz"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            E-posta
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="branches">
            Branşlar
          </label>
          <Select
            id="branches"
            multiple
            value={formData.branches}
            onChange={(e) => setFormData({ ...formData, branches: Array.from(e.target.selectedOptions, option => option.value) })}
          >
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
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
              'Öğretmeni Güncelle'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

