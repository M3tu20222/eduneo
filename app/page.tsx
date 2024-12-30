import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold cyberpunk-text">EduNeon</h1>
        <nav>
          <Link href="/login" className="cyberpunk-button mr-4">Giriş Yap</Link>
          <Link href="/about" className="text-foreground hover:text-neon-blue transition-colors">Hakkımızda</Link>
        </nav>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl font-bold mb-6 cyberpunk-text">
          Geleceğin Eğitim Platformu
        </h2>
        <p className="text-xl mb-8 max-w-2xl">
          EduNeon ile öğrenme deneyiminizi dijital çağa taşıyın. Öğretmenler, öğrenciler ve yöneticiler için tasarlanmış, kullanımı kolay ve etkili bir okul yönetim sistemi.
        </p>
        <div className="space-x-4">
          <Button className="cyberpunk-button">
            <Link href="/login">Hemen Başla</Link>
          </Button>
          <Button variant="outline" className="cyberpunk-border cyberpunk-glow text-neon-yellow">
            Daha Fazla Bilgi
          </Button>
        </div>
      </main>
      
      <footer className="w-full py-4 text-center">
        <p className="text-muted-foreground">&copy; 2023 EduNeon. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

