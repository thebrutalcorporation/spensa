"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConn = void 0;
const core_1 = require("@mikro-orm/core");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const Transaction_1 = require("../entities/Transaction");
exports.testConn = () => {
    child_process_1.exec(`createdb spensa-test`);
    return core_1.MikroORM.init({
        clientUrl: "postgresql://charlieastrada@localhost:5432/spensa-test",
        entities: [Transaction_1.Transaction, core_1.BaseEntity],
        migrations: {
            path: path_1.default.join(__dirname, "./migrations"),
            pattern: /^[\w-]+\d+\.[tj]s$/,
        },
        type: "postgresql",
    });
};
//# sourceMappingURL=testConn.js.map