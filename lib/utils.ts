import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverage(grades: { value: number }[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
  return Math.round(sum / grades.length);
}
