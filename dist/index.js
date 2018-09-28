"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const fs = require("fs");
const util = require("util");
dotenv.load();
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const main = () => __awaiter(this, void 0, void 0, function* () {
    const collationResult = yield hasDesiredClass();
    console.log(collationResult);
    if (collationResult.result) {
        const reservedClassesStr = yield readFileAsync("./src/reserved.json", {
            encoding: "utf8",
        });
        const reservedClasses = JSON.parse(reservedClassesStr);
        let isAlreadyReserved = false;
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
});
const getClasses = () => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield page.goto("https://wellness.sfc.keio.ac.jp/index.php?page=top&limit=9999&semester=20185&lang=ja", {
        waitUntil: "domcontentloaded",
    });
    const classTable = yield page.$$("#maincontents > div:nth-child(8) > table > tbody > tr");
    const classInfoArray = [];
    for (let c of classTable) {
        let classInfoString = yield c.$eval("td.w3-hide-large.w3-hide-medium", elements => {
            return elements.textContent;
        });
        let classInfo = yield parseClassInfoString(classInfoString);
        yield classInfoArray.push(classInfo);
    }
    yield console.log(classInfoArray);
    yield browser.close();
    return classInfoArray;
});
const loginAndReserve = () => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield page.goto("https://wellness.sfc.keio.ac.jp/index.php?page=top&semester=20185&lang=ja", {
        waitUntil: "domcontentloaded",
    });
    yield page.type("#maincontents > form > div > table > tbody > tr:nth-child(1) > td > input", process.env.LOGIN_NAME, { delay: 100 });
    yield page.type("#maincontents > form > div > table > tbody > tr:nth-child(2) > td > input", process.env.PASSWORD, { delay: 100 });
    yield page.click(`#maincontents > form > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type="submit"]`);
    yield page.waitFor(100);
    yield page.screenshot({ path: "logined.png", fullPage: true });
    yield page.waitFor(100);
    yield page.click("#navbar > div > div:nth-child(1) > button");
    yield page.waitFor(100);
    yield page.click(`#dropdown1 > div > form > input[type="submit"]:nth-child(6)`);
    yield page.waitFor(100);
    yield page.screenshot({ path: "logouted.png", fullPage: true });
    yield browser.close();
});
const parseClassInfoString = (classInfoString) => __awaiter(this, void 0, void 0, function* () {
    const splitedString = classInfoString.split(/^日時: |種目: |教員: |シラバス: /);
    const dateInfo = yield parseDayString(splitedString[1]);
    return Object.assign({}, dateInfo, { event: splitedString[2], teacher: splitedString[3] });
});
const parseDayString = (dayString) => __awaiter(this, void 0, void 0, function* () {
    const SplitedArray = yield dayString.split(/月|日\(\D\)\s|限/);
    const _dow = calDOW(Number(SplitedArray[0]), Number(SplitedArray[1]));
    return {
        month: Number(SplitedArray[0]),
        day: Number(SplitedArray[1]),
        dow: _dow,
        period: Number(SplitedArray[2]),
    };
});
const calDOW = (month, day) => {
    //FIXME:2018決め打ちはまずい
    const date = new Date(2018, month - 1, day);
    return date.getDay();
};
//FIXME:型
const hasDesiredClass = () => __awaiter(this, void 0, void 0, function* () {
    const desiredClassName = process.env.DESIRED_CLASS_NAME;
    const classes = yield getClasses();
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
});
// getClasses();
const test = () => __awaiter(this, void 0, void 0, function* () {
    yield main();
    // await writeFileAsync("./src/reserved.json", JSON.stringify({}));
});
test();
//# sourceMappingURL=index.js.map