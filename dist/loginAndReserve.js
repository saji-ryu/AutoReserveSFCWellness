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
const loginAndReserve = (toReserveIndex) => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch();
    const page = yield browser.newPage();
    yield page.goto("https://wellness.sfc.keio.ac.jp/index.php?page=top&semester=20185&lang=ja", {
        waitUntil: "domcontentloaded",
    });
    yield page.type("#maincontents > form > div > table > tbody > tr:nth-child(1) > td > input", process.env.LOGIN_NAME, { delay: 100 });
    yield page.type("#maincontents > form > div > table > tbody > tr:nth-child(2) > td > input", process.env.PASSWORD, { delay: 100 });
    yield page.click(`#maincontents > form > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type="submit"]`);
    yield page.waitFor(200);
    yield page.click("#maincontents > ul:nth-child(8) > li > a");
    yield page.waitFor(300);
    yield page.click(`#maincontents > div:nth-last-child(1) > table > tbody > tr:nth-child(${toReserveIndex +
        1}) > td:nth-child(8) > a`);
    yield page.waitFor(300);
    yield page.click(`#maincontents > form > p > input[type="submit"]:nth-child(1)`);
    yield page.waitFor(300);
    yield page.click(`#maincontents > form > p > input[type="submit"]:nth-child(1)`);
    yield page.waitFor(100);
    yield page.click("#navbar > div > div:nth-child(1) > button");
    yield page.waitFor(100);
    yield page.click(`#dropdown1 > div > form > input[type="submit"]:nth-child(6)`);
    yield browser.close();
});
exports.default = loginAndReserve;
//# sourceMappingURL=loginAndReserve.js.map