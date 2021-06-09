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
require("dotenv/config");
const es_1 = __importDefault(require("faker/locale/es"));
require("reflect-metadata");
const application_1 = __importDefault(require("../application"));
const Transaction_1 = require("../entities/Transaction");
const User_1 = require("../entities/User");
const createTxn_1 = __importDefault(require("../test-utils/fixtures/createTxn"));
const createTxnOptions_1 = require("../test-utils/fixtures/createTxnOptions");
const createUser_1 = __importDefault(require("../test-utils/fixtures/createUser"));
const queries_mutations_1 = require("../test-utils/queries-mutations");
const clearDatabaseTable_1 = require("../test-utils/services/clearDatabaseTable");
let orm;
let em;
let testClientQuery;
let testClientMutate;
let testSetOptions;
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should create a txn successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield createUser_1.default(orm);
            const txnToBeCreated = createTxnOptions_1.createTxnOptions();
            testSetOptions({
                request: {
                    session: {
                        userId: user.id,
                    },
                },
            });
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: { options: txnToBeCreated },
            });
            const newlyCreatedTxn = (_a = response.data) === null || _a === void 0 ? void 0 : _a.createTransaction;
            const dbTxn = yield em.findOne(Transaction_1.Transaction, {
                id: newlyCreatedTxn.id,
            });
            expect(newlyCreatedTxn.id).toBe(dbTxn === null || dbTxn === void 0 ? void 0 : dbTxn.id);
        }));
        test("should return all transactions", () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const user = yield createUser_1.default(orm);
            yield Promise.all([...Array(5)].map(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield createTxn_1.default(orm, user.id);
            })));
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.GET_ALL_TXNS);
            const transactions = (_b = res.data) === null || _b === void 0 ? void 0 : _b.transactions;
            const dbTxns = yield em.find(Transaction_1.Transaction, {});
            transactions.forEach((transaction) => {
                const matchingDbTxn = dbTxns.filter((dbTxn) => dbTxn.id === transaction.id)[0];
                expect(transaction.title).toEqual(matchingDbTxn.title);
            });
        }));
        test("should return a transaction by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield createUser_1.default(orm);
            const txn = yield createTxn_1.default(orm, user.id);
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.GET_TXN, {
                variables: { id: txn.id },
            });
            const returnedTxn = res.data.transaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, {
                id: txn.id,
            });
            expect(returnedTxn.id).toBe(txn.id);
            expect(returnedTxn.title).toBe(txn.title);
            expect(returnedTxn.id).toBe(dbTxn.id);
            expect(returnedTxn.title).toBe(dbTxn.title);
        }));
        test("should update a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield createUser_1.default(orm);
            const txn = yield createTxn_1.default(orm, user.id);
            const originalId = txn.id;
            const originalTitle = txn.title;
            const newTitle = es_1.default.company.companyName();
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.UPDATE_TXN, {
                variables: { id: txn.id, title: newTitle },
            });
            const updatedTxn = res.data.updateTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: updatedTxn.id });
            expect(updatedTxn.id).toBe(originalId);
            expect(updatedTxn.title).not.toBe(originalTitle);
            expect(updatedTxn.id).toBe(dbTxn === null || dbTxn === void 0 ? void 0 : dbTxn.id);
            expect(updatedTxn.title).toBe(dbTxn.title);
            expect(dbTxn.title).not.toBe(originalId);
        }));
        test("should delete a transaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield createUser_1.default(orm);
            const txn = yield createTxn_1.default(orm, user.id);
            const res = yield testClientQuery(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.DELETE_TXN, {
                variables: { id: txn.id },
            });
            const isTxnDeleted = res.data.deleteTransaction;
            const [dbTxn] = yield em.find(Transaction_1.Transaction, { id: txn.id });
            expect(isTxnDeleted).toBe(true);
            expect(dbTxn).toBe(undefined);
        }));
    });
    describe("Validations", () => {
        test("should return an error when creating txn when user not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const txnToBeCreated = createTxnOptions_1.createTxnOptions();
            const expectedErrorMessage = "Not authenticated!";
            testSetOptions({
                request: {
                    session: {
                        userId: undefined,
                    },
                },
            });
            const response = yield testClientMutate(queries_mutations_1.TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
                variables: { options: txnToBeCreated },
            });
            const receivedErrorMessage = (_a = response.errors) === null || _a === void 0 ? void 0 : _a[0].message;
            expect(response.errors).not.toBe(null);
            expect(receivedErrorMessage).toBe(expectedErrorMessage);
        }));
    });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const application = application_1.default();
    yield application.connect();
    yield application.init();
    orm = yield application.getOrm();
    const apolloServer = yield application.getApolloServer();
    em = orm.em.fork();
    const { query, mutate, setOptions } = apollo_server_integration_testing_1.createTestClient({
        apolloServer,
    });
    testClientMutate = mutate;
    testClientQuery = query;
    testSetOptions = setOptions;
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabaseTable_1.clearDatabaseTable(orm, Transaction_1.Transaction);
    yield clearDatabaseTable_1.clearDatabaseTable(orm, User_1.User);
    jest.resetAllMocks();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield orm.close();
}));
//# sourceMappingURL=transaction.test.js.map