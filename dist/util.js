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
//# sourceMappingURL=util.js.map