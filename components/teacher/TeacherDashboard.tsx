"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

interface TeacherInfo {
  name: string;
  email: string;
  branches: string[];
  classes: string[];
}

interface TeacherDashboardProps {
  userId: string;
}

export function TeacherDashboard({ userId }: TeacherDashboardProps) {
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await fetch(`/api/teacher/info?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Öğretmen bilgileri alınamadı");
        }
        const data = await response.json();
        setTeacherInfo(data);
      } catch (error) {
        console.error("Öğretmen bilgileri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherInfo();
  }, [userId]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!teacherInfo) {
    return <div>Öğretmen bilgileri bulunamadı.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2" />
            Derslerim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{teacherInfo.branches.join(", ")}</p>
          <Link href="/teacher/courses">
            <Button className="mt-4 w-full cyberpunk-button">
              Dersleri Görüntüle
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2" />
            Sınıflarım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{teacherInfo.classes.join(", ")}</p>
          <Link href="/teacher/classes">
            <Button className="mt-4 w-full cyberpunk-button">
              Sınıfları Görüntüle
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2" />
            Ödevler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/teacher/assignments">
            <Button className="mt-4 w-full cyberpunk-button">
              Ödevleri Yönet
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardCheck className="mr-2" />
            Not Girişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/teacher/grades">
            <Button className="mt-4 w-full cyberpunk-button">
              Not Girişi Yap
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2" />
            Takvim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/teacher/calendar">
            <Button className="mt-4 w-full cyberpunk-button">
              Takvimi Görüntüle
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
