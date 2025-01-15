import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Attendance {
  course: string;
  totalClasses: number;
  attendedClasses: number;
}

interface AttendanceOverviewProps {
  attendance: Attendance[];
}

export default function AttendanceOverview({
  attendance,
}: AttendanceOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devamsızlık Özeti</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ders</TableHead>
              <TableHead>Toplam Ders</TableHead>
              <TableHead>Katılınan Ders</TableHead>
              <TableHead>Devamsızlık Oranı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.course}</TableCell>
                <TableCell>{item.totalClasses}</TableCell>
                <TableCell>{item.attendedClasses}</TableCell>
                <TableCell>
                  {(
                    ((item.totalClasses - item.attendedClasses) /
                      item.totalClasses) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
