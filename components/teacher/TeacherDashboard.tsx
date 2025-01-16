"use client";

import React, { useState, useEffect } from "react";
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
  firstName: string;
  lastName: string;
  email: string;
  branches: { name: string }[];
  courses: { name: string }[];
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
    return (
      <div className="text-center text-2xl font-bold text-neon-blue animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  if (!teacherInfo) {
    return (
      <div className="text-center text-2xl font-bold text-destructive">
        Öğretmen bilgileri bulunamadı.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-neon-pink animate-pulse">
        Öğretmen Paneli
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Derslerim Card */}
        <Card className="border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-neon-blue">
              <BookOpen className="mr-2" />
              Derslerim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground">
              {teacherInfo.courses.map((course) => course.name).join(", ")}
            </p>
            <Link href="/teacher/courses" passHref>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-neon-blue hover:text-background">
                Dersleri Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Branşlarım Card */}
        <Card className="border-2 border-neon-purple shadow-lg hover:shadow-neon-purple transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-neon-purple">
              <Users className="mr-2" />
              Branşlarım
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground">
              {teacherInfo.branches.map((branch) => branch.name).join(", ")}
            </p>
            <Link href="/teacher/branches" passHref>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-neon-purple hover:text-background">
                Branşları Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Ödevler Card */}
        <Card className="border-2 border-neon-yellow shadow-lg hover:shadow-neon-yellow transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-neon-yellow">
              <ClipboardList className="mr-2" />
              Ödevler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/teacher/assignments" passHref>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-neon-yellow hover:text-background">
                Ödevleri Yönet
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Not Girişi Card */}
        <Card className="border-2 border-neon-pink shadow-lg hover:shadow-neon-pink transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-neon-pink">
              <ClipboardCheck className="mr-2" />
              Not Girişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/teacher/grades" passHref>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-neon-pink hover:text-background">
                Not Girişi Yap
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Takvim Card */}
        <Card className="border-2 border-neon-blue shadow-lg hover:shadow-neon-blue transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-neon-blue">
              <Calendar className="mr-2" />
              Takvim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/teacher/calendar" passHref>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-neon-blue hover:text-background">
                Takvimi Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
