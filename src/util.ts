import { ClassInfo, DateInfo } from "./interfaces";

export const parseClassInfoString = async (
  classInfoString: string
): Promise<ClassInfo> => {
  const splitedString = classInfoString.split(
    /^日時: |種目: |教員: |シラバス: /
  );
  const dateInfo = await parseDayString(splitedString[1]);
  return {
    ...dateInfo,
    event: splitedString[2],
    teacher: splitedString[3],
  };
};

const parseDayString = async (dayString: string): Promise<DateInfo> => {
  const SplitedArray = await dayString.split(/月|日\(\D\)\s|限/);
  const _dow = calDOW(Number(SplitedArray[0]), Number(SplitedArray[1]));
  return {
    month: Number(SplitedArray[0]),
    day: Number(SplitedArray[1]),
    dow: _dow,
    period: Number(SplitedArray[2]),
  };
};

const calDOW = (month: number, day: number): number => {
  //FIXME:2018決め打ちはまずい
  const date = new Date(2018, month - 1, day);
  return date.getDay();
};
