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
const apollo_server_testing_1 = require("apollo-server-testing");
require("reflect-metadata");
const testConn_1 = require("../test-utils/testConn");
const apollo_server_express_1 = require("apollo-server-express");
const createSchema_1 = require("../utils/createSchema");
const User_1 = require("../entities/User");
const factories_1 = require("../test-utils/factories");
const queries_mutations_1 = require("../test-utils/queries-mutations");
let dbConn;
let em;
let server;
describe("Transaction Resolver", () => {
    describe("Happy Path", () => {
        test("should register a new user successfully ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const userToRegister = factories_1.genUserOptions();
            const registeredUserResponse = yield registerUser(userToRegister.username, userToRegister.password, userToRegister.email);
            const dbUser = yield em.findOne(User_1.User, {
                id: (_a = registeredUserResponse.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            expect(registeredUserResponse.user).not.toBe(null);
            expect(registeredUserResponse.errors).toBe(null);
            expect((_b = registeredUserResponse.user) === null || _b === void 0 ? void 0 : _b.username).not.toBe(null);
            expect((_c = registeredUserResponse.user) === null || _c === void 0 ? void 0 : _c.username).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.username);
        }));
        test("should log in a new user successfully with username ", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const response = yield mutate({
                mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN,
                variables: {
                    usernameOrEmail: user.username,
                    password: user.password,
                },
            });
            const loginResponse = response.data.login;
            const loggedInUser = loginResponse.user;
            const dbUser = yield em.findOne(User_1.User, {
                id: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id,
            });
            expect(loggedInUser).not.toBe(null);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username).toBe(user.username);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id);
        }));
        test("should log in a new user successfully with email ", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const response = yield mutate({
                mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN,
                variables: {
                    usernameOrEmail: user.email,
                    password: user.password,
                },
            });
            const loginResponse = response.data.login;
            const loggedInUser = loginResponse.user;
            const dbUser = yield em.findOne(User_1.User, {
                id: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id,
            });
            expect(loggedInUser).not.toBe(null);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username).toBe(user.username);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id);
        }));
        xtest("should return current user if logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    describe("Registration Validations", () => {
        test("should not permit registration with username with lengths <= 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { username: "me" });
            const registeredUserResponse = yield registerUser(newUser.username, newUser.password, newUser.email);
            const errors = registeredUserResponse.errors;
            const firstError = errors ? errors[0] : null;
            expect(registeredUserResponse.user).toBe(null);
            expect(errors).toHaveLength(1);
            expect(firstError).not.toBe(null);
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.field).toBe("username");
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.message).toBe("length must be greater than 2");
        }));
        test("should not permit registration with invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { email: "improperlyformattedemail" });
            const registeredUserResponse = yield registerUser(newUser.username, newUser.password, newUser.email);
            const errors = registeredUserResponse.errors;
            const firstError = errors ? errors[0] : null;
            expect(registeredUserResponse.user).toBe(null);
            expect(errors).toHaveLength(1);
            expect(firstError).not.toBe(null);
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.field).toBe("email");
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.message).toBe("invalid email");
        }));
        test("should not permit registration with password with length < 6", () => __awaiter(void 0, void 0, void 0, function* () {
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { password: "abc" });
            const registeredUserResponse = yield registerUser(newUser.username, newUser.password, newUser.email);
            const errors = registeredUserResponse.errors;
            const firstError = errors ? errors[0] : null;
            expect(registeredUserResponse.user).toBe(null);
            expect(errors).toHaveLength(1);
            expect(firstError).not.toBe(null);
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.field).toBe("password");
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.message).toBe("length must be at least 6 characters");
        }));
        test("should not permit registration if username exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const userToRegister = factories_1.genUserOptions();
            yield registerUser(userToRegister.username, userToRegister.password, userToRegister.email);
            const newUserToRegister = Object.assign({}, userToRegister);
            const duplicateRegisteredUserResponse = yield registerUser(newUserToRegister.username, newUserToRegister.password, newUserToRegister.email);
            const errors = duplicateRegisteredUserResponse.errors;
            const firstError = errors ? errors[0] : null;
            expect(duplicateRegisteredUserResponse.user).toBe(null);
            expect(errors).toHaveLength(1);
            expect(firstError).not.toBe(null);
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.field).toBe("username");
            expect(firstError === null || firstError === void 0 ? void 0 : firstError.message).toBe("username already taken.");
        }));
    });
    describe("Login Validations", () => {
        test("should not permit login with incorrect username", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { username: "nonexistent" });
            const expectedErrors = [
                { field: "usernameOrEmail", message: "user does not exist!" },
            ];
            const response = yield mutate({
                mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN,
                variables: {
                    usernameOrEmail: newUser.username,
                    password: newUser.password,
                },
            });
            const loginResponse = response.data.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
        test("should not permit login with incorrect email", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { email: "incorrectemail@test.com" });
            const expectedErrors = [
                { field: "usernameOrEmail", message: "user does not exist!" },
            ];
            const response = yield mutate({
                mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN,
                variables: {
                    usernameOrEmail: newUser.email,
                    password: newUser.password,
                },
            });
            const loginResponse = response.data.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
        test("should not permit login with incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
            const { mutate } = server;
            const userToRegister = factories_1.genUserOptions();
            yield registerUser(userToRegister.username, userToRegister.password, userToRegister.email);
            const userWrongPassword = Object.assign(Object.assign({}, userToRegister), { password: "wrongpassword" });
            const expectedErrors = [{ field: "password", message: "Invalid login!" }];
            const response = yield mutate({
                mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN,
                variables: {
                    usernameOrEmail: userWrongPassword.username,
                    password: userWrongPassword.password,
                },
            });
            const loginResponse = response.data.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
    });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    dbConn = yield testConn_1.testConn();
    em = dbConn.em;
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield createSchema_1.createSchema(),
        context: () => ({
            em,
            req: { session: {} },
        }),
    });
    server = apollo_server_testing_1.createTestClient(apolloServer);
    yield em.nativeDelete(User_1.User, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield dbConn.close();
}));
function registerUser(username, password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mutate } = server;
        const userToCreate = {
            username,
            password,
            email,
        };
        const response = yield mutate({
            mutation: queries_mutations_1.USER_QUERIES_AND_MUTATIONS.REGISTER,
            variables: { options: userToCreate },
        });
        const userResponse = response.data.register;
        return userResponse;
    });
}
//# sourceMappingURL=user.test.js.map