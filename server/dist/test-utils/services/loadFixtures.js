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
exports.loadFixtures = void 0;
const Transaction_1 = require("../../entities/Transaction");
const User_1 = require("../../entities/User");
const createUserFixture_1 = require("../fixtures/createUserFixture");
const createTxnFixture_1 = require("../fixtures/createTxnFixture");
const createSimpleUuid_1 = __importDefault(require("../helpers/createSimpleUuid"));
const loadFixtures = (orm, fixtureSet) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fixtureSet === "user" || fixtureSet === "all") {
            yield Promise.all([...Array(5)].map((_, userIndex) => __awaiter(void 0, void 0, void 0, function* () {
                const user = orm.em.create(User_1.User, yield createUserFixture_1.createUserFixture());
                user.id = createSimpleUuid_1.default(userIndex + 1);
                yield orm.em.persist(user);
                return user;
            })));
        }
        if (fixtureSet === "transaction" || fixtureSet === "all") {
            yield Promise.all([...Array(5)].map((_, txnIndex) => __awaiter(void 0, void 0, void 0, function* () {
                const txn = orm.em.create(Transaction_1.Transaction, createTxnFixture_1.createTxnFixture());
                txn.id = createSimpleUuid_1.default(txnIndex + 1);
                yield orm.em.persist(txn);
                return txn;
            })));
        }
        yield orm.em.flush();
    }
    catch (error) {
        console.error("📌 Could not load fixtures", error);
    }
});
exports.loadFixtures = loadFixtures;
//# sourceMappingURL=loadFixtures.js.map