"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function ToastExample() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Başarılı!",
          description: "İşlem başarıyla tamamlandı.",
        })
      }}
    >
      Toast Göster
    </Button>
  )
}

