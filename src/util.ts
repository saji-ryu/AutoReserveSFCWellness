import {
  ClassInfo,
  ClassInfoArray,
  DateInfo,
  DesiredClassInfoArray,
  CollationResult,
} from "./interfaces";
import * as fs from "fs";
import * as util from "util";

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

export const readFileAsync = util.promisify(fs.readFile);
export const writeFileAsync = util.promisify(fs.writeFile);

export const localCheck = async (
  classes: ClassInfoArray
): Promise<CollationResult> => {
  const resultClassArray = [];
  const resultIndexArray = [];
  const desiredClass: DesiredClassInfoArray = await JSON.parse(
    await readFileAsync("desired.json", {
      encoding: "utf8",
    })
  );
  const reservedClass: ClassInfoArray = await JSON.parse(
    await readFileAsync("reserved.json", {
      encoding: "utf8",
    })
  );
  let isAlreadyRserve: boolean = false;
  for (let i = 0; i < classes.length; i++) {
    for (let d of desiredClass) {
      if (
        classes[i].event === d.event &&
        classes[i].dow === d.dow &&
        classes[i].period === d.period
      ) {
        isAlreadyRserve = false;
        for (let r of reservedClass) {
          if (
            classes[i].month === r.month &&
            classes[i].day === r.day &&
            classes[i].period === r.period
          ) {
            isAlreadyRserve = true;
            console.log(
              `already reserved : ${classes[i].event}(${classes[i].month}/${
                classes[i].day
              })`
            );
            break;
          }
        }
        if (!isAlreadyRserve) {
          console.log(
            `reserving : ${classes[i].event}(${classes[i].month}/${
              classes[i].day
            })`
          );
          await resultClassArray.push(classes[i]);
          await resultIndexArray.push(i);
        }
      }
    }
  }

  return {
    result: resultClassArray.length > 0 ? true : false,
    indexes: resultClassArray.length > 0 ? resultIndexArray : null,
    details: resultClassArray.length > 0 ? resultClassArray : null,
  };
};
