"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTxnOptions = void 0;
const es_1 = __importDefault(require("faker/locale/es"));
const Category_1 = require("../../entities/Category");
const Transaction_1 = require("../../entities/Transaction");
const getRandomIntInclusive_1 = require("../helpers/getRandomIntInclusive");
function createTxnOptions(orm) {
    return __awaiter(this, void 0, void 0, function* () {
        const em = orm.em.fork();
        const categories = yield em.find(Category_1.Category, {});
        const amount = Number(es_1.default.finance.amount());
        const currency = getRandomItemFromObject(Transaction_1.Currency);
        const details = es_1.default.commerce.productDescription();
        const isDiscretionary = es_1.default.datatype.boolean();
        const title = es_1.default.company.companyName();
        const txnDate = es_1.default.date.recent().toISOString();
        const type = getRandomItemFromObject(Transaction_1.Type);
        const filteredCategories = categories.filter((category) => category.type === type);
        const category = getRandomItemFromArray(filteredCategories)
            .id;
        return {
            amount,
            category,
            currency,
            details,
            isDiscretionary,
            title,
            txnDate,
            type,
        };
    });
}
exports.createTxnOptions = createTxnOptions;
function getRandomItemFromObject(object) {
    return Object.keys(object)[getRandomIntInclusive_1.getRandomIntInclusive(0, Object.keys(object).length - 1)].toLowerCase();
}
function getRandomItemFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
//# sourceMappingURL=createTxnOptions.js.map