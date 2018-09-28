import * as puppeteer from "puppeteer";

const loginAndReserve = async (toReserveIndex: number): Promise<void> => {
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
  await page.waitFor(200);
  await page.click("#maincontents > ul:nth-child(8) > li > a");
  await page.waitFor(300);
  await page.click(
    `#maincontents > div:nth-last-child(1) > table > tbody > tr:nth-child(${toReserveIndex +
      1}) > td:nth-child(8) > a`
  );
  await page.waitFor(300);
  await page.click(
    `#maincontents > form > p > input[type="submit"]:nth-child(1)`
  );
  await page.waitFor(300);
  await page.click(
    `#maincontents > form > p > input[type="submit"]:nth-child(1)`
  );
  await page.waitFor(100);
  await page.click("#navbar > div > div:nth-child(1) > button");
  await page.waitFor(100);
  await page.click(
    `#dropdown1 > div > form > input[type="submit"]:nth-child(6)`
  );
  await browser.close();
};

export default loginAndReserve;
