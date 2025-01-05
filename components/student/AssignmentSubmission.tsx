import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  pointValue: number;
}

interface AssignmentSubmissionProps {
  assignment: Assignment;
}

const AssignmentSubmission: React.FC<AssignmentSubmissionProps> = ({
  assignment,
}) => {
  const { toast } = useToast();

  const submitAssignment = async () => {
    try {
      const response = await fetch("/api/student/submit-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignmentId: assignment._id }),
      });

      if (!response.ok) {
        throw new Error("Ödev teslim edilirken bir hata oluştu");
      }

      const data = await response.json();
      toast({
        title: "Ödev Teslim Edildi",
        description: `Ödev başarıyla teslim edildi! Kazanılan puan: ${data.pointsEarned}`,
      });
    } catch (error) {
      console.error("Ödev teslim hatası:", error);
      toast({
        title: "Hata",
        description: "Ödev teslim edilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">{assignment.title}</h3>
      <p className="text-gray-600">{assignment.description}</p>
      <p className="text-sm text-gray-500">
        Teslim Tarihi: {new Date(assignment.dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm font-medium text-indigo-600">
        Puan Değeri: {assignment.pointValue}
      </p>
      <Button onClick={submitAssignment} className="mt-4">
        Ödevi Teslim Et
      </Button>
    </div>
  );
};

export default AssignmentSubmission;
