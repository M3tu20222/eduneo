"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Teacher {
  id: string;
  name: string;
}

interface MessageTeacherProps {
  teachers: Teacher[];
}

export default function MessageTeacher({ teachers }: MessageTeacherProps) {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedTeacher || !message) return;

    setSending(true);
    try {
      const response = await fetch("/api/student/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Mesaj gönderilemedi");
      }

      setMessage("");
      alert("Mesaj başarıyla gönderildi");
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      alert("Mesaj gönderilirken bir hata oluştu");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Öğretmene Mesaj Gönder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedTeacher} value={selectedTeacher}>
            <SelectTrigger>
              <SelectValue placeholder="Öğretmen seçin" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Mesajınızı yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !selectedTeacher || !message}
          >
            {sending ? "Gönderiliyor..." : "Gönder"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
