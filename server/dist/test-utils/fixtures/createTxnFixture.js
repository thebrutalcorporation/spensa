"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTxnFixture = void 0;
const es_1 = __importDefault(require("faker/locale/es"));
function createTxnFixture() {
    const title = es_1.default.company.companyName();
    return {
        title,
    };
}
exports.createTxnFixture = createTxnFixture;
//# sourceMappingURL=createTxnFixture.js.map