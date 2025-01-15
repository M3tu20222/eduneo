"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, FileText, MessageSquare } from "lucide-react";

interface StudentDashboardProps {
  userId: string;
}

export default function StudentDashboard({ userId }: StudentDashboardProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Öğrenci Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/student/courses`} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2" />
                Derslerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Kayıtlı olduğunuz dersleri görüntüleyin.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/student/assignments`} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Ödevlerim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Mevcut ödevlerinizi görüntüleyin ve teslim edin.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/student/grades`} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2" />
                Notlarım
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ders notlarınızı ve genel akademik performansınızı görüntüleyin.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/student/send-message`} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" />
                Öğretmene Mesaj Gönder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Öğretmenlerinize mesaj gönderin.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
