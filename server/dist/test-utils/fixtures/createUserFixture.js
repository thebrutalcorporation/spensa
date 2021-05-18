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
exports.createUserFixture = void 0;
const argon2_1 = __importDefault(require("argon2"));
const es_1 = __importDefault(require("faker/locale/es"));
function createUserFixture() {
    return __awaiter(this, void 0, void 0, function* () {
        const firstName = es_1.default.name.firstName().toLowerCase();
        const lastName = es_1.default.name.lastName().toLowerCase();
        const fullName = `${firstName}_${lastName}`;
        const textPwd = es_1.default.internet.password();
        const password = yield argon2_1.default.hash(textPwd);
        const email = es_1.default.internet.email().toLowerCase();
        return {
            username: fullName,
            password,
            email,
        };
    });
}
exports.createUserFixture = createUserFixture;
//# sourceMappingURL=createUserFixture.js.map