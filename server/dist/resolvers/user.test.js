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
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_integration_testing_1 = require("apollo-server-integration-testing");
const ioredis_1 = __importDefault(require("ioredis"));
require("reflect-metadata");
const User_1 = require("../entities/User");
const factories_1 = require("../test-utils/factories");
const queries_mutations_1 = require("../test-utils/queries-mutations");
const testConn_1 = require("../test-utils/testConn");
const createSchema_1 = require("../utils/createSchema");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
jest.mock("../utils/sendEmail", () => {
    return {
        sendEmail: jest.fn(),
    };
});
let dbConn;
let em;
let apolloServer;
let testClientQuery;
let testClientMutate;
let testClientSetOptions;
describe("User Resolver", () => {
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
            var _d;
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: user.username,
                    password: user.password,
                },
            });
            const loginResponse = (_d = response.data) === null || _d === void 0 ? void 0 : _d.login;
            const loggedInUser = loginResponse.user;
            const dbUser = yield em.findOne(User_1.User, {
                id: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id,
            });
            expect(loggedInUser).not.toBe(null);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username).toBe(user.username);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id);
        }));
        test("should log in a new user successfully with email ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: user.email,
                    password: user.password,
                },
            });
            const loginResponse = (_e = response.data) === null || _e === void 0 ? void 0 : _e.login;
            const loggedInUser = loginResponse.user;
            const dbUser = yield em.findOne(User_1.User, {
                id: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id,
            });
            expect(loggedInUser).not.toBe(null);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.username).toBe(user.username);
            expect(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id).toBe(dbUser === null || dbUser === void 0 ? void 0 : dbUser.id);
        }));
        test("should return current user if logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g;
            const userOptions = factories_1.genUserOptions();
            yield registerUser(userOptions.username, userOptions.password, userOptions.email);
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: userOptions.username,
                    password: userOptions.password,
                },
            });
            const loginResponse = (_f = response.data) === null || _f === void 0 ? void 0 : _f.login;
            const loggedInUser = loginResponse.user;
            const res = yield testClientQuery(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.ME);
            const me = (_g = res.data) === null || _g === void 0 ? void 0 : _g.me;
            expect(me.id).toBe(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id);
        }));
        test("should log out a user successfull ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _h;
            testClientSetOptions({
                request: {
                    session: {
                        destroy: jest.fn((cb) => cb()),
                    },
                },
            });
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const logoutResponse = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGOUT);
            expect((_h = logoutResponse.data) === null || _h === void 0 ? void 0 : _h.logout).toBe(true);
        }));
        test("should send a forgot password email if requested ", () => __awaiter(void 0, void 0, void 0, function* () {
            var _j;
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            const forgotPasswordResponse = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.FORGOT_PASSWORD, {
                variables: { email: user.email },
            });
            expect(sendEmail_1.sendEmail).toHaveBeenCalledTimes(1);
            expect((_j = forgotPasswordResponse.data) === null || _j === void 0 ? void 0 : _j.forgotPassword).toBe(true);
        }));
        xtest("should allow users to change their password", () => __awaiter(void 0, void 0, void 0, function* () {
            var _k, _l, _m, _o;
            uuid_1.v4.mockImplementation(() => "e4b3a253-a1d1-4331-bf45-eb68afeb91b9");
            const user = factories_1.genUserOptions();
            yield registerUser(user.username, user.password, user.email);
            yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.FORGOT_PASSWORD, {
                variables: { email: user.email },
            });
            const token = uuid_1.v4();
            const newPassword = "newPassword911";
            const changePasswordResponse = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.CHANGE_PASSWORD, {
                variables: { token, newPassword },
            });
            const loginResponseOldPassword = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: user.username,
                    password: user.password,
                },
            });
            const oldPwdLoginAttempt = (_k = loginResponseOldPassword.data) === null || _k === void 0 ? void 0 : _k.login;
            const loginResponseNewPassword = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: user.username,
                    password: newPassword,
                },
            });
            const newPwdLoginAttempt = (_l = loginResponseNewPassword.data) === null || _l === void 0 ? void 0 : _l.login;
            expect((_m = changePasswordResponse.data) === null || _m === void 0 ? void 0 : _m.ChangePassword.user).not.toBe(null);
            expect((_o = changePasswordResponse.data) === null || _o === void 0 ? void 0 : _o.ChangePassword.user.username).toBe(user.username);
            expect(oldPwdLoginAttempt.user).toBe(null);
            expect(newPwdLoginAttempt.user).not.toBe(null);
            expect(newPwdLoginAttempt.user.username).toBe(user.username);
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
            const invalidEmails = [
                "email",
                "email@",
                "email@test",
                "mail@gooogle.com",
                "email@mailinator.com",
            ];
            const registrationResponses = yield Promise.all(invalidEmails.map((email) => __awaiter(void 0, void 0, void 0, function* () {
                const newUser = Object.assign(Object.assign({}, defaultUserOptions), { email });
                const registeredUserResponse = yield registerUser(newUser.username, newUser.password, newUser.email);
                return registeredUserResponse;
            })));
            registrationResponses.forEach((response) => {
                const errors = response.errors;
                const firstError = errors ? errors[0] : null;
                expect(response.user).toBe(null);
                expect(errors).toHaveLength(1);
                expect(firstError).not.toBe(null);
                expect(firstError === null || firstError === void 0 ? void 0 : firstError.field).toBe("email");
                expect(firstError === null || firstError === void 0 ? void 0 : firstError.message).toBe("invalid email");
            });
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
            var _a;
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { username: "nonexistent" });
            const expectedErrors = [
                { field: "usernameOrEmail", message: "user does not exist!" },
            ];
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: newUser.username,
                    password: newUser.password,
                },
            });
            const loginResponse = (_a = response.data) === null || _a === void 0 ? void 0 : _a.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
        test("should not permit login with incorrect email", () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const defaultUserOptions = factories_1.genUserOptions();
            const newUser = Object.assign(Object.assign({}, defaultUserOptions), { email: "incorrectemail@test.com" });
            const expectedErrors = [
                { field: "usernameOrEmail", message: "user does not exist!" },
            ];
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: newUser.email,
                    password: newUser.password,
                },
            });
            const loginResponse = (_b = response.data) === null || _b === void 0 ? void 0 : _b.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
        test("should not permit login with incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const userToRegister = factories_1.genUserOptions();
            yield registerUser(userToRegister.username, userToRegister.password, userToRegister.email);
            const userWrongPassword = Object.assign(Object.assign({}, userToRegister), { password: "wrongpassword" });
            const expectedErrors = [{ field: "password", message: "Invalid login!" }];
            const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.LOGIN, {
                variables: {
                    usernameOrEmail: userWrongPassword.username,
                    password: userWrongPassword.password,
                },
            });
            const loginResponse = (_c = response.data) === null || _c === void 0 ? void 0 : _c.login;
            const errors = loginResponse.errors;
            expect(loginResponse.user).toBe(null);
            expect(errors).not.toBe(null);
            expect(errors).toEqual(expect.arrayContaining(expectedErrors));
        }));
    });
});
beforeEach(() => {
    jest.resetAllMocks();
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
    yield em.nativeDelete(User_1.User, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield dbConn.close();
}));
function registerUser(username, password, email) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userToCreate = {
            username,
            password,
            email,
        };
        const response = yield testClientMutate(queries_mutations_1.USER_QUERIES_AND_MUTATIONS.REGISTER, {
            variables: { options: userToCreate },
        });
        const userResponse = (_a = response.data) === null || _a === void 0 ? void 0 : _a.register;
        return userResponse;
    });
}
//# sourceMappingURL=user.test.js.map