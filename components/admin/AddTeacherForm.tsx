'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface Branch {
  _id: string
  name: string
}

interface Class {
  _id: string
  name: string
}

export function AddTeacherForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branches: [] as string[],
    classes: [] as string[],
  })
  const [branches, setBranches] = useState<Branch[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchBranches()
    fetchClasses()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/admin/branches')
      if (response.ok) {
        const data = await response.json()
        setBranches(data)
      }
    } catch (error) {
      console.error('Branşları getirme hatası:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Sınıfları getirme hatası:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Öğretmen eklenirken bir hata oluştu')
      }

      router.push('/admin/teachers')
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
          <label className="text-sm font-medium" htmlFor="password">
            Şifre
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
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
            required
          >
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="classes">
            Sınıflar
          </label>
          <Select
            id="classes"
            multiple
            value={formData.classes}
            onChange={(e) => setFormData({ ...formData, classes: Array.from(e.target.selectedOptions, option => option.value) })}
            required
          >
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
                Kaydediliyor...
              </>
            ) : (
              'Öğretmen Ekle'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

