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
const apollo_server_testing_1 = require("apollo-server-testing");
require("reflect-metadata");
const faker_1 = __importDefault(require("faker"));
const testConn_1 = require("../test-utils/testConn");
const apollo_server_express_1 = require("apollo-server-express");
const createSchema_1 = require("../utils/createSchema");
const Transaction_1 = require("../entities/Transaction");
let dbConn;
let em;
let server;
let seededTxn;
const queriesAndMutations = {
    GET_ALL_TXNS: `query allTransactions{
  transactions {
    id
    title
    createdAt
    updatedAt

  }
}`,
    CREATE_TXN: `mutation createTransaction($title:String!){
  createTransaction(title:$title) {
    id
    title
    createdAt
    updatedAt
  }
}`,
    GET_TXN: `query getTransactionById($id:String!) {
  transaction(id:$id){
    id
    title
    createdAt
    updatedAt
  }
}`,
    UPDATE_TXN: `mutation updateTransaction($id:String!, $title:String!){
  updateTransaction(id:$id ,title:$title){
    id
    title
    createdAt
    updatedAt
  }
}`,
    DELETE_TXN: `mutation deleteTransaction($id:String!){
  deleteTransaction(id:$id)
}`,
};
faker_1.default.locale = "es";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    dbConn = yield testConn_1.testConn();
    em = dbConn.em;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield createSchema_1.createSchema(),
        context: () => ({ em }),
    });
    server = apollo_server_testing_1.createTestClient(apolloServer);
    const { mutate } = server;
    const response = yield mutate({
        mutation: queriesAndMutations.CREATE_TXN,
        variables: {
            title: faker_1.default.company.companyName(),
        },
    });
    seededTxn = (_a = response.data) === null || _a === void 0 ? void 0 : _a.createTransaction;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield em.nativeDelete(Transaction_1.Transaction, {});
    yield dbConn.close();
}));
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should create a txn successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const txnToBeCreatedVariables = {
                title: faker_1.default.company.companyName(),
            };
            const { mutate } = server;
            const response = yield mutate({
                mutation: queriesAndMutations.CREATE_TXN,
                variables: txnToBeCreatedVariables,
            });
            let newlyCreatedTxn = response.data.createTransaction;
            newlyCreatedTxn.createdAt = new Date(Number(newlyCreatedTxn.createdAt));
            newlyCreatedTxn.updatedAt = new Date(Number(newlyCreatedTxn.updatedAt));
            let dbTxn = yield em.findOne(Transaction_1.Transaction, {
                id: newlyCreatedTxn.id,
            });
            newlyCreatedTxn = JSON.parse(JSON.stringify(newlyCreatedTxn));
            dbTxn = JSON.parse(JSON.stringify(Object.assign({}, dbTxn)));
            expect(newlyCreatedTxn).toEqual(dbTxn);
        }));
        test("should return all transactions", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = server;
            const res = yield query({ query: queriesAndMutations.GET_ALL_TXNS });
            const transactions = res.data.transactions;
            const dbTxns = yield em.find(Transaction_1.Transaction, {});
            transactions.forEach((transaction) => {
                const matchingDbTxn = dbTxns.filter((dbTxn) => dbTxn.id === transaction.id)[0];
                expect(transaction.title).toEqual(matchingDbTxn.title);
            });
        }));
        test("should return a transaction by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = server;
            const seededTxnId = seededTxn.id;
            const seededTxnTitle = seededTxn.title;
            const res = yield query({
                query: queriesAndMutations.GET_TXN,
                variables: { id: seededTxnId },
            });
            const transaction = res.data.transaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, {
                id: seededTxnId,
            });
            expect(transaction.id).toBe(seededTxn.id);
            expect(transaction.title).toBe(seededTxnTitle);
            expect(transaction.id).toBe(dbTxn.id);
            expect(transaction.title).toBe(dbTxn.title);
        }));
        test("should update a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = server;
            const seededTxnId = seededTxn.id;
            const seededTxnTitle = seededTxn.title;
            const newTitle = faker_1.default.company.companyName();
            const res = yield query({
                query: queriesAndMutations.UPDATE_TXN,
                variables: { id: seededTxnId, title: newTitle },
            });
            const updatedTxn = res.data.updateTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: seededTxnId });
            expect(updatedTxn.id).toBe(seededTxn.id);
            expect(updatedTxn.title).not.toBe(seededTxnTitle);
            expect(updatedTxn.id).toBe(dbTxn.id);
            expect(updatedTxn.title).toBe(dbTxn.title);
            expect(dbTxn.title).not.toBe(seededTxnTitle);
        }));
        test("should delete a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const { query } = server;
            const seededTxnId = seededTxn.id;
            const res = yield query({
                query: queriesAndMutations.DELETE_TXN,
                variables: { id: seededTxnId },
            });
            const isTxnDeleted = res.data.deleteTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: seededTxnId });
            expect(isTxnDeleted).toBe(true);
            expect(dbTxn).toBe(undefined);
        }));
    });
});
//# sourceMappingURL=transaction.test.js.map