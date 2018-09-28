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
const dotenv = require("dotenv");
const fs = require("fs");
const util = require("util");
const getClasses_1 = require("./getClasses");
const loginAndReserve_1 = require("./loginAndReserve");
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
            yield loginAndReserve_1.default(collationResult.index);
            const newReservedClasses = reservedClasses;
            yield newReservedClasses.push(collationResult.detail);
            yield writeFileAsync("./src/reserved.json", JSON.stringify(newReservedClasses));
        }
        else {
            console.log("already reserved");
        }
    }
    else {
        console.log("not found");
    }
});
const hasDesiredClass = () => __awaiter(this, void 0, void 0, function* () {
    const desiredClassName = process.env.DESIRED_CLASS_NAME;
    const classes = yield getClasses_1.default();
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
});
main();
//# sourceMappingURL=index.js.map