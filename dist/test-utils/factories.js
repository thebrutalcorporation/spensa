"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUserOptions = void 0;
const faker_1 = __importDefault(require("faker"));
faker_1.default.locale = "es";
function genUserOptions() {
    const firstName = faker_1.default.name.firstName().toLowerCase();
    const lastName = faker_1.default.name.lastName().toLowerCase();
    const fullName = `${firstName}_${lastName}`;
    const password = faker_1.default.internet.password();
    return {
        username: fullName,
        password,
    };
}
exports.genUserOptions = genUserOptions;
//# sourceMappingURL=factories.js.map