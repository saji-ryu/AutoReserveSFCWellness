import * as puppeteer from "puppeteer";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as util from "util";
import {
  ClassInfo,
  ClassInfoArray,
  DateInfo,
  CollationResult,
} from "./interfaces";

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
      loginAndReserve();
    }
  }
};

const getClasses = async (): Promise<ClassInfoArray> => {
  const browser: puppeteer.Browser = await puppeteer.launch();
  const page: puppeteer.Page = await browser.newPage();
  await page.goto(
    "https://wellness.sfc.keio.ac.jp/index.php?page=top&limit=9999&semester=20185&lang=ja",
    {
      waitUntil: "domcontentloaded",
    }
  );
  const classTable: Array<puppeteer.ElementHandle> = await page.$$(
    "#maincontents > div:nth-child(8) > table > tbody > tr"
  );
  const classInfoArray: ClassInfoArray = [];
  for (let c of classTable) {
    let classInfoString: string = await c.$eval(
      "td.w3-hide-large.w3-hide-medium",
      elements => {
        return elements.textContent;
      }
    );
    let classInfo = await parseClassInfoString(classInfoString);
    await classInfoArray.push(classInfo);
  }
  await console.log(classInfoArray);
  await browser.close();
  return classInfoArray;
};

const loginAndReserve = async (): Promise<void> => {
  const browser: puppeteer.Browser = await puppeteer.launch();
  const page: puppeteer.Page = await browser.newPage();
  await page.goto(
    "https://wellness.sfc.keio.ac.jp/index.php?page=top&semester=20185&lang=ja",
    {
      waitUntil: "domcontentloaded",
    }
  );
  await page.type(
    "#maincontents > form > div > table > tbody > tr:nth-child(1) > td > input",
    process.env.LOGIN_NAME,
    { delay: 100 }
  );
  await page.type(
    "#maincontents > form > div > table > tbody > tr:nth-child(2) > td > input",
    process.env.PASSWORD,
    { delay: 100 }
  );
  await page.click(
    `#maincontents > form > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type="submit"]`
  );
  await page.waitFor(100);
  await page.screenshot({ path: "logined.png", fullPage: true });
  await page.waitFor(100);
  await page.click("#navbar > div > div:nth-child(1) > button");
  await page.waitFor(100);
  await page.click(
    `#dropdown1 > div > form > input[type="submit"]:nth-child(6)`
  );
  await page.waitFor(100);
  await page.screenshot({ path: "logouted.png", fullPage: true });
  await browser.close();
};

const parseClassInfoString = async (
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

//FIXME:型
const hasDesiredClass = async (): Promise<CollationResult> => {
  const desiredClassName: string = process.env.DESIRED_CLASS_NAME;
  const classes = await getClasses();
  for (let c of classes) {
    if (c.event === desiredClassName) {
      return {
        result: true,
        detail: c,
      };
    }
  }
  return {
    result: false,
    detail: null,
  };
};
// getClasses();
const test = async () => {
  await main();
  // await writeFileAsync("./src/reserved.json", JSON.stringify({}));
};

test();
