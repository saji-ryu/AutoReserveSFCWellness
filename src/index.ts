import * as dotenv from "dotenv";
import * as fs from "fs";
import * as util from "util";
import getClasses from "./getClasses";
import loginAndReserve from "./loginAndReserve";
import { ClassInfoArray, CollationResult } from "./interfaces";

dotenv.load();
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const main = async (): Promise<void> => {
  const collationResult: CollationResult = await hasDesiredClass();
  console.log(collationResult);
  if (collationResult.result) {
    const reservedClassesStr: string = await readFileAsync(
      "./src/reserved.json",
      {
        encoding: "utf8",
      }
    );
    const reservedClasses: ClassInfoArray = JSON.parse(reservedClassesStr);
    let isAlreadyReserved: boolean = false;
    for (let rc of reservedClasses) {
      isAlreadyReserved =
        rc.month == collationResult.detail.month &&
        rc.day == collationResult.detail.day &&
        rc.event == collationResult.detail.event;
      if (isAlreadyReserved) {
        break;
      }
    }
    if (!isAlreadyReserved) {
      await loginAndReserve(collationResult.index);
      const newReservedClasses = reservedClasses;
      await newReservedClasses.push(collationResult.detail);
      await writeFileAsync(
        "./src/reserved.json",
        JSON.stringify(newReservedClasses)
      );
    } else {
      console.log("already reserved");
    }
  } else {
    console.log("not found");
  }
};

const hasDesiredClass = async (): Promise<CollationResult> => {
  const desiredClassName: string = process.env.DESIRED_CLASS_NAME;
  const classes = await getClasses();
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].event === desiredClassName) {
      return {
        result: true,
        index: i,
        detail: classes[i],
      };
    }
  }
  return {
    result: false,
    index: null,
    detail: null,
  };
};

main();
