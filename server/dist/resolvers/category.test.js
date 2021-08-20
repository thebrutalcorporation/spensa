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
require("reflect-metadata");
const application_1 = __importDefault(require("../application"));
const Category_1 = require("../entities/Category");
const queries_mutations_1 = require("../test-utils/queries-mutations");
let orm;
let em;
let testClientQuery;
let testClientMutate;
let testSetOptions;
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should return all categories", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const res = yield testClientQuery(queries_mutations_1.CATEGORY_QUERIES_AND_MUTATIONS.GET_ALL_CATEGORIES);
            const categories = (_a = res.data) === null || _a === void 0 ? void 0 : _a.categories;
            const dbCategories = yield em.find(Category_1.Category, {});
            categories.forEach((category) => {
                const matchingCategory = dbCategories.filter((dbCategory) => dbCategory.id === category.id)[0];
                expect(category.id).toEqual(matchingCategory.id);
                expect(category.name).toEqual(matchingCategory.name);
                expect(category.type).toEqual(matchingCategory.type);
            });
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
    const { query } = apollo_server_integration_testing_1.createTestClient({
        apolloServer,
    });
    testClientQuery = query;
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.resetAllMocks();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield orm.close();
}));
//# sourceMappingURL=category.test.js.map