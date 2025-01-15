import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CourseScheduleProps {
  schedule: {
    day: string;
    courses: {
      name: string;
      time: string;
      teacher: string;
      classroom: string;
    }[];
  }[];
}

export default function CourseSchedule({ schedule }: CourseScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Haftalık Ders Programı</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gün</TableHead>
              <TableHead>Ders</TableHead>
              <TableHead>Saat</TableHead>
              <TableHead>Öğretmen</TableHead>
              <TableHead>Sınıf</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((day) =>
              day.courses.map((course, index) => (
                <TableRow key={`${day.day}-${index}`}>
                  {index === 0 && (
                    <TableCell rowSpan={day.courses.length}>
                      {day.day}
                    </TableCell>
                  )}
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.time}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>{course.classroom}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
