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
const util_1 = require("./util");
const puppeteer = require("puppeteer");
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
        let classInfo = yield util_1.parseClassInfoString(classInfoString);
        yield classInfoArray.push(classInfo);
    }
    yield browser.close();
    return classInfoArray;
});
exports.default = getClasses;
//# sourceMappingURL=getClasses.js.map