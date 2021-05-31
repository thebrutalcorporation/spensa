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
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../../entities/User");
const createUserOptions_1 = require("./createUserOptions");
const createUser = (orm, userOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const user = orm.em.create(User_1.User, userOptions || (yield createUserOptions_1.createUserOptions()));
    user.password = yield argon2_1.default.hash(user.password);
    yield orm.em.persistAndFlush(user);
    return user;
});
exports.default = createUser;
//# sourceMappingURL=createUser.js.map