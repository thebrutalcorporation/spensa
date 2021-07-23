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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../entities/User");
const createTxnOptions_1 = require("./createTxnOptions");
const Transaction_1 = require("../../entities/Transaction");
const createTxn = (orm, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const em = orm.em.fork();
    const txn = em.create(Transaction_1.Transaction, yield createTxnOptions_1.createTxnOptions(orm));
    txn.user = em.getRepository(User_1.User).getReference(userId);
    yield em.persistAndFlush(txn);
    return txn;
});
exports.default = createTxn;
//# sourceMappingURL=createTxn.js.map