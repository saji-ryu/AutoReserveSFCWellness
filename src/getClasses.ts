import { ClassInfoArray } from "./interfaces";
import { parseClassInfoString } from "./util";
import * as puppeteer from "puppeteer";
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
  await browser.close();
  return classInfoArray;
};

export default getClasses;
