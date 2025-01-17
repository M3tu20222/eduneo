"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  GraduationCap,
  FileText,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface StudentDashboardProps {
  userId: string;
}

export default function StudentDashboard({ userId }: StudentDashboardProps) {
  return (
    <div className="min-h-screen p-8 bg-gray-900 text-neon-blue">
      <h1 className="text-4xl font-bold mb-6 cyberpunk-text text-center">
        Öğrenci Paneli
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/student/courses" passHref>
          <Card className="cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-neon-yellow">
                <Book className="mr-2" />
                Derslerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-pink">
                Kayıtlı olduğunuz dersleri görüntüleyin.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/assignments" passHref>
          <Card className="cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-neon-green">
                <FileText className="mr-2" />
                Ödevlerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-blue">
                Mevcut ödevlerinizi görüntüleyin ve teslim edin.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/grades" passHref>
          <Card className="cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-neon-purple">
                <GraduationCap className="mr-2" />
                Notlarım
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-yellow">
                Ders notlarınızı ve genel akademik performansınızı görüntüleyin.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/schedule" passHref>
          <Card className="cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-neon-pink">
                <Calendar className="mr-2" />
                Ders Programı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-green">
                Haftalık ders programınızı görüntüleyin.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/student/messages" passHref>
          <Card className="cyberpunk-border cyberpunk-glow cursor-pointer transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-neon-blue">
                <MessageCircle className="mr-2" />
                Mesajlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neon-yellow">
                Öğretmenlerinizle iletişim kurun ve mesajlarınızı yönetin.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
