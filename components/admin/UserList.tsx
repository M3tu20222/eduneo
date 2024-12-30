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

interface User {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Kullanıcılar yüklenirken bir hata oluştu')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      setError('Kullanıcılar yüklenirken bir hata oluştu')
      console.error('Kullanıcıları yükleme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Kullanıcı silinirken bir hata oluştu')
        }
        fetchUsers() // Listeyi yenile
      } catch (error) {
        console.error('Kullanıcı silme hatası:', error)
        setError('Kullanıcı silinirken bir hata oluştu')
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
            <TableHead>Kullanıcı Adı</TableHead>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(user._id)}
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

