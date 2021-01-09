"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const transaction_1 = require("../resolvers/transaction");
const type_graphql_1 = require("type-graphql");
const user_1 = require("../resolvers/user");
exports.createSchema = () => {
    return type_graphql_1.buildSchema({
        resolvers: [transaction_1.TransactionResolver, user_1.UserResolver],
        validate: false,
    });
};
//# sourceMappingURL=createSchema.js.map