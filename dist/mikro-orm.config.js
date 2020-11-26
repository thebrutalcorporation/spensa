"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const BaseEntity_1 = require("./entities/BaseEntity");
const Transaction_1 = require("./entities/Transaction");
exports.default = {
    clientUrl: "postgresql://charlieastrada@localhost:5432/spensa",
    debug: process.env.NODE_ENV !== "production",
    entities: [Transaction_1.Transaction, BaseEntity_1.BaseEntity],
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    type: "postgresql",
};
//# sourceMappingURL=mikro-orm.config.js.map