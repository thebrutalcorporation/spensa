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
require("reflect-metadata");
const gqlCall_1 = require("../test-utils/gqlCall");
const testConn_1 = require("../test-utils/testConn");
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConn_1.testConn();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield conn.close();
}));
const helloQuery = `
query {
  hello 
}
`;
describe("hello resolver", () => {
    test("should say hello world ", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const expected = "hello world";
        const result = yield gqlCall_1.gqlCall({
            source: helloQuery,
        });
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.hello).toBe(expected);
    }));
});
//# sourceMappingURL=hello.test.js.map