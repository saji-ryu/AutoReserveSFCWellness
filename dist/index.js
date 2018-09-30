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
const cron_1 = require("cron");
const getClasses_1 = require("./getClasses");
const util_1 = require("./util");
dotenv.load();
const reserve = (indexArray) => __awaiter(this, void 0, void 0, function* () {
    for (const i of indexArray) {
        // await loginAndReserve(i);
    }
});
//main();
const job = new cron_1.CronJob("*/5 * * * * *", () => __awaiter(this, void 0, void 0, function* () {
    const collationResult = yield util_1.localCheck(yield getClasses_1.default());
    if (collationResult.result) {
        job.stop();
        yield reserve(collationResult.indexes);
        const preReservedClasses = yield JSON.parse(yield util_1.readFileAsync("reserved.json", {
            encoding: "utf8",
        }));
        const newReservedClasses = [];
        //await newReservedClasses.push(...preReservedClasses);
        //await newReservedClasses.push(...collationResult.details);
        yield util_1.writeFileAsync("reserved.json", yield JSON.stringify([
            ...preReservedClasses,
            ...collationResult.details,
        ]));
        yield console.log(`reserve ${collationResult.indexes.length} class(es)`);
        yield job.start();
    }
    else {
        console.log("no much class");
    }
}), null, true);
//# sourceMappingURL=index.js.map