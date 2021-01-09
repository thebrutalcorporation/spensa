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
const User_1 = require("../entities/User");
let dbConn;
let em;
let server;
let seedUser;
const queriesAndMutations = {
    REGISTER: `mutation register($options: UsernamePasswordInput!) {
  register(options: $options) {
    user {
      id      
      username
    }
    errors {
      field
      message
    }
  }
}
`,
    LOGIN: `mutation login($options:UsernamePasswordInput!) {
  login(options:$options) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`,
};
faker_1.default.locale = "es";
const seedUserOptions = { username: "seed", password: "seed123" };
function registerUser(username = seedUserOptions.username, password = seedUserOptions.password) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mutate } = server;
        const userToCreate = {
            username,
            password,
        };
        const response = yield mutate({
            mutation: queriesAndMutations.REGISTER,
            variables: { options: userToCreate },
        });
        const userResponse = response.data.register;
        return userResponse;
    });
}
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    dbConn = yield testConn_1.testConn();
    em = dbConn.em;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield createSchema_1.createSchema(),
        context: () => ({ em }),
    });
    server = apollo_server_testing_1.createTestClient(apolloServer);
    const seedUserResponse = yield registerUser();
    if (seedUserResponse.user) {
        seedUser = seedUserResponse.user;
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield em.nativeDelete(User_1.User, {});
    yield dbConn.close();
}));
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should register a new user successfully ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const registeredUserResponse = yield registerUser("test", "test123");
            let dbUser = yield em.findOne(User_1.User, {
                id: (_a = registeredUserResponse.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            expect(registeredUserResponse.user).not.toBe(null);
            expect(registeredUserResponse.errors).toBe(null);
            expect((_b = registeredUserResponse.user) === null || _b === void 0 ? void 0 : _b.username).toBe("test");
            expect((_c = registeredUserResponse.user) === null || _c === void 0 ? void 0 : _c.username).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.username);
        }));
        test("should log in a new user successfully ", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const response = yield mutate({
                mutation: queriesAndMutations.LOGIN,
                variables: {
                    options: {
                        username: seedUserOptions.username,
                        password: seedUserOptions.password,
                    },
                },
            });
            const loginResponse = response.data.login;
            const loggedInUser = loginResponse.user;
            let dbUser = yield em.findOne(User_1.User, {
                id: seedUser.id,
            });
            expect(loggedInUser).not.toBe(null);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username).toBe(seedUser.username);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id);
        }));
    });
});
//# sourceMappingURL=user.test.js.map