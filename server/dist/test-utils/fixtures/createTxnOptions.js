"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTxnOptions = void 0;
const es_1 = __importDefault(require("faker/locale/es"));
const Transaction_1 = require("../../entities/Transaction");
const getRandomIntInclusive_1 = require("../helpers/getRandomIntInclusive");
function createTxnOptions() {
    const amount = Number(es_1.default.finance.amount());
    const currency = getRandomItemFromObject(Transaction_1.Currency);
    const details = es_1.default.commerce.productDescription();
    const isDiscretionary = es_1.default.datatype.boolean();
    const title = es_1.default.company.companyName();
    const txnDate = es_1.default.date.recent().toISOString();
    const type = getRandomItemFromObject(Transaction_1.Type);
    return {
        amount,
        currency,
        details,
        isDiscretionary,
        title,
        txnDate,
        type,
    };
}
exports.createTxnOptions = createTxnOptions;
function getRandomItemFromObject(object) {
    return Object.keys(object)[getRandomIntInclusive_1.getRandomIntInclusive(0, Object.keys(object).length - 1)].toLowerCase();
}
//# sourceMappingURL=createTxnOptions.js.map