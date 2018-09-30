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
const fs = require("fs");
const util = require("util");
exports.parseClassInfoString = (classInfoString) => __awaiter(this, void 0, void 0, function* () {
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
exports.readFileAsync = util.promisify(fs.readFile);
exports.writeFileAsync = util.promisify(fs.writeFile);
exports.localCheck = (classes) => __awaiter(this, void 0, void 0, function* () {
    const resultClassArray = [];
    const resultIndexArray = [];
    const desiredClass = yield JSON.parse(yield exports.readFileAsync("desired.json", {
        encoding: "utf8",
    }));
    const reservedClass = yield JSON.parse(yield exports.readFileAsync("reserved.json", {
        encoding: "utf8",
    }));
    let isAlreadyRserve = false;
    // console.log(`reserved:${JSON.stringify(reservedClass)}`);
    for (let i = 0; i < classes.length; i++) {
        for (let d of desiredClass) {
            if (classes[i].event === d.event &&
                classes[i].dow === d.dow &&
                classes[i].period === d.period) {
                isAlreadyRserve = false;
                for (let r of reservedClass) {
                    if (classes[i].month === r.month &&
                        classes[i].day === r.day &&
                        classes[i].period === r.period) {
                        isAlreadyRserve = true;
                        console.log(`already reserved : ${classes[i].event}(${classes[i].month}/${classes[i].day})`);
                        break;
                    }
                }
                if (!isAlreadyRserve) {
                    console.log(`reserving : ${classes[i].event}(${classes[i].month}/${classes[i].day})`);
                    yield resultClassArray.push(classes[i]);
                    yield resultIndexArray.push(i);
                }
            }
        }
    }
    return {
        result: resultClassArray.length > 0 ? true : false,
        indexes: resultClassArray.length > 0 ? resultIndexArray : null,
        details: resultClassArray.length > 0 ? resultClassArray : null,
    };
});
//# sourceMappingURL=util.js.map