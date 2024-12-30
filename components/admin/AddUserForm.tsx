'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// ... (diğer import'lar ve interface'ler aynı kalacak)

export function AddUserForm() {
  // ... (state ve diğer fonksiyonlar aynı kalacak)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Kullanıcı ekleme işlemi başarısız oldu.')
      }

      const result = await response.json()
      console.log('Kullanıcı ekleme sonucu:', result)

      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla eklendi",
      })

      router.push('/admin/users')
      router.refresh()
    } catch (err) {
      console.error('Kullanıcı ekleme hatası:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setError(errorMessage);
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  // ... (render kısmı aynı kalacak)
}

