export type ClassInfoArray = Array<ClassInfo>;
export type ClassInfo = {
  month: number;
  day: number;
  dow: number;
  period: number;
  event: string;
  teacher: string;
};
export type DateInfo = {
  month: number;
  day: number;
  dow: number;
  period: number;
};
export type CollationResult = {
  result: boolean;
  detail: ClassInfo | null;
};
