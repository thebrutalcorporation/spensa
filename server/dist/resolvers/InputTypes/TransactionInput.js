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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInput = void 0;
const type_graphql_1 = require("type-graphql");
const Transaction_1 = require("../../entities/Transaction");
let TransactionInput = class TransactionInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], TransactionInput.prototype, "amount", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransactionInput.prototype, "currency", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], TransactionInput.prototype, "details", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], TransactionInput.prototype, "isDiscretionary", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransactionInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], TransactionInput.prototype, "txnDate", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TransactionInput.prototype, "type", void 0);
TransactionInput = __decorate([
    type_graphql_1.InputType()
], TransactionInput);
exports.TransactionInput = TransactionInput;
//# sourceMappingURL=TransactionInput.js.map