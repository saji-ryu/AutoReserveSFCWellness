export type ClassInfoArray = Array<ClassInfo>;
export type DesiredClassInfoArray = Array<DesiredClassInfo>;
export type ClassInfo = {
  month: number;
  day: number;
  dow: number;
  period: number;
  event: string;
  teacher: string;
};
export type DesiredClassInfo = {
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
  indexes: Array<number>;
  details: Array<ClassInfo> | null;
};
