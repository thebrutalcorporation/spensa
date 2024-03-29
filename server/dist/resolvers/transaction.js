"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionResolver = void 0;
const Transaction_1 = require("../entities/Transaction");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const TransactionInput_1 = require("./InputTypes/TransactionInput");
let TransactionResolver = class TransactionResolver {
    transactions({ em }) {
        return em.find(Transaction_1.Transaction, {});
    }
    transaction(id, { em }) {
        return em.findOne(Transaction_1.Transaction, { id });
    }
    createTransaction(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = em.create(Transaction_1.Transaction, {
                amount: options.amount,
                category: options.category,
                currency: options.currency,
                details: options.details,
                isDiscretionary: options.isDiscretionary,
                title: options.title,
                txnDate: options.txnDate,
                type: options.type,
                user: req.session.userId,
            });
            yield em.persistAndFlush(transaction);
            return transaction;
        });
    }
    updateTransaction(id, title, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield em.findOne(Transaction_1.Transaction, { id });
            if (!transaction) {
                return null;
            }
            if (typeof title != undefined && title !== transaction.title) {
                transaction.title = title;
                yield em.persistAndFlush(transaction);
            }
            return transaction;
        });
    }
    deleteTransaction(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield em.findOne(Transaction_1.Transaction, { id });
            if (!transaction) {
                return false;
            }
            yield em.removeAndFlush(transaction);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Transaction_1.Transaction]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "transactions", null);
__decorate([
    type_graphql_1.Query(() => Transaction_1.Transaction, { nullable: true }),
    __param(0, type_graphql_1.Arg("id", () => String)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "transaction", null);
__decorate([
    type_graphql_1.Mutation(() => Transaction_1.Transaction),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("options")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TransactionInput_1.TransactionInput, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "createTransaction", null);
__decorate([
    type_graphql_1.Mutation(() => Transaction_1.Transaction, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("title")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "updateTransaction", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "deleteTransaction", null);
TransactionResolver = __decorate([
    type_graphql_1.Resolver()
], TransactionResolver);
exports.TransactionResolver = TransactionResolver;
//# sourceMappingURL=transaction.js.map