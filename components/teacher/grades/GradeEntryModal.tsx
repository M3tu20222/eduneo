"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (grade: number) => void;
  studentName?: string;
}

export function GradeEntryModal({
  isOpen,
  onClose,
  onSubmit,
  studentName,
}: GradeEntryModalProps) {
  const [grade, setGrade] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(grade);
    setGrade(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Not Girişi - {studentName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Not Değeri</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[grade]}
                  onValueChange={(value) => setGrade(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-20"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
