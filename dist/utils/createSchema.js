"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const hello_1 = require("../resolvers/hello");
const transaction_1 = require("../resolvers/transaction");
const type_graphql_1 = require("type-graphql");
exports.createSchema = () => {
    return type_graphql_1.buildSchema({
        resolvers: [hello_1.HelloResolver, transaction_1.TransactionResolver],
        validate: false,
    });
};
//# sourceMappingURL=createSchema.js.map