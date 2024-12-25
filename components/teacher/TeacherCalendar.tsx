"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  date: Date;
  description: string;
}

interface TeacherCalendarProps {
  userId: string;
}

export function TeacherCalendar({ userId }: TeacherCalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/teacher/events?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Etkinlikler alınamadı");
        }
        const data = await response.json();
        setEvents(
          data.map((event: any) => ({ ...event, date: new Date(event.date) }))
        );
      } catch (error) {
        console.error("Etkinlikler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const selectedDateEvents = events.filter(
    (event) => event.date.toDateString() === selectedDate?.toDateString()
  );

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle>Takvim</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card className="cyberpunk-border cyberpunk-glow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Etkinlikler</span>
            <Button className="cyberpunk-button">
              <Plus className="mr-2" />
              Yeni Etkinlik
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length > 0 ? (
            <ul className="space-y-2">
              {selectedDateEvents.map((event) => (
                <li key={event._id} className="border-b pb-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Seçili tarihte etkinlik bulunmamaktadır.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
