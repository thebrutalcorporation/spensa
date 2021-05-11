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
const apollo_server_integration_testing_1 = require("apollo-server-integration-testing");
require("reflect-metadata");
const es_1 = __importDefault(require("faker/locale/es"));
const testConn_1 = require("../test-utils/testConn");
const apollo_server_express_1 = require("apollo-server-express");
const ioredis_1 = __importDefault(require("ioredis"));
const createSchema_1 = require("../utils/createSchema");
const Transaction_1 = require("../entities/Transaction");
const queries_mutations_1 = require("../test-utils/queries-mutations");
let dbConn;
let em;
let apolloServer;
let testClientQuery;
let testClientMutate;
let testClientSetOptions;
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should create a txn successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const txnToBeCreatedVariables = {
                title: es_1.default.company.companyName(),
            };
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: txnToBeCreatedVariables,
            });
            let newlyCreatedTxn = (_a = response.data) === null || _a === void 0 ? void 0 : _a.createTransaction;
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
            var _b;
            yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: {
                    title: es_1.default.company.companyName(),
                },
            });
            yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: {
                    title: es_1.default.company.companyName(),
                },
            });
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.GET_ALL_TXNS);
            const transactions = (_b = res.data) === null || _b === void 0 ? void 0 : _b.transactions;
            const dbTxns = yield em.find(Transaction_1.Transaction, {});
            transactions.forEach((transaction) => {
                const matchingDbTxn = dbTxns.filter((dbTxn) => dbTxn.id === transaction.id)[0];
                expect(transaction.title).toEqual(matchingDbTxn.title);
            });
        }));
        test("should return a transaction by id", () => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: {
                    title: es_1.default.company.companyName(),
                },
            });
            const newlyCreatedTxn = (_c = response.data) === null || _c === void 0 ? void 0 : _c.createTransaction;
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.GET_TXN, {
                variables: { id: newlyCreatedTxn.id },
            });
            const returnedTxn = res.data.transaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, {
                id: newlyCreatedTxn.id,
            });
            expect(returnedTxn.id).toBe(newlyCreatedTxn.id);
            expect(returnedTxn.title).toBe(newlyCreatedTxn.title);
            expect(returnedTxn.id).toBe(dbTxn.id);
            expect(returnedTxn.title).toBe(dbTxn.title);
        }));
        test("should update a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: {
                    title: es_1.default.company.companyName(),
                },
            });
            const newlyCreatedTxn = response.data.createTransaction;
            const newTitle = es_1.default.company.companyName();
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.UPDATE_TXN, {
                variables: { id: newlyCreatedTxn.id, title: newTitle },
            });
            const updatedTxn = res.data.updateTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: updatedTxn.id });
            expect(updatedTxn.id).toBe(newlyCreatedTxn.id);
            expect(updatedTxn.title).not.toBe(newlyCreatedTxn.title);
            expect(updatedTxn.id).toBe(dbTxn === null || dbTxn === void 0 ? void 0 : dbTxn.id);
            expect(updatedTxn.title).toBe(dbTxn.title);
            expect(dbTxn.title).not.toBe(newlyCreatedTxn.title);
        }));
        test("should delete a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: {
                    title: es_1.default.company.companyName(),
                },
            });
            const newlyCreatedTxn = response.data.createTransaction;
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.DELETE_TXN, {
                variables: { id: newlyCreatedTxn.id },
            });
            const isTxnDeleted = res.data.deleteTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: newlyCreatedTxn.id });
            expect(isTxnDeleted).toBe(true);
            expect(dbTxn).toBe(undefined);
        }));
    });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    dbConn = yield testConn_1.testConn();
    em = dbConn.em;
    const redis = new ioredis_1.default();
    apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield createSchema_1.createSchema(),
        context: ({ req, res }) => ({ em, req, res, redis }),
    });
    const { query, mutate, setOptions } = apollo_server_integration_testing_1.createTestClient({
        apolloServer,
        extendMockRequest: {
            session: {
                userId: null,
            },
        },
    });
    testClientMutate = mutate;
    testClientQuery = query;
    testClientSetOptions = setOptions;
    yield em.nativeDelete(Transaction_1.Transaction, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield dbConn.close();
}));
//# sourceMappingURL=transaction.test.js.map