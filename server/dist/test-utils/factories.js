"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUserOptions = void 0;
const es_1 = __importDefault(require("faker/locale/es"));
function genUserOptions() {
    const firstName = es_1.default.name.firstName().toLowerCase();
    const lastName = es_1.default.name.lastName().toLowerCase();
    const fullName = `${firstName}_${lastName}`;
    const password = es_1.default.internet.password();
    const email = es_1.default.internet.email().toLowerCase();
    return {
        username: fullName,
        password,
        email,
    };
}
exports.genUserOptions = genUserOptions;
//# sourceMappingURL=factories.js.map