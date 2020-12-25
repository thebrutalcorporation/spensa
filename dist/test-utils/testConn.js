"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConn = void 0;
const core_1 = require("@mikro-orm/core");
const child_process_1 = require("child_process");
const BaseEntity_1 = require("../entities/BaseEntity");
const Transaction_1 = require("../entities/Transaction");
exports.testConn = () => {
    child_process_1.exec(`createdb spensa-test`);
    return core_1.MikroORM.init({
        clientUrl: "postgresql://charlieastrada@localhost:5432/spensa-test",
        entities: [BaseEntity_1.BaseEntity, Transaction_1.Transaction],
        type: "postgresql",
    });
};
//# sourceMappingURL=testConn.js.map