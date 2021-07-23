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
exports.CategoryName = exports.Type = exports.Category = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const BaseEntity_1 = require("./BaseEntity");
const uuid_1 = require("uuid");
const Transaction_1 = require("./Transaction");
let Category = class Category extends BaseEntity_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = uuid_1.v4();
        this.transactions = new core_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    core_1.PrimaryKey({ type: "uuid" }),
    __metadata("design:type", Object)
], Category.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Enum(() => Type),
    __metadata("design:type", String)
], Category.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Enum(() => CategoryName),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [Transaction_1.Transaction]),
    core_1.OneToMany(() => Transaction_1.Transaction, (transaction) => transaction.category),
    __metadata("design:type", Object)
], Category.prototype, "transactions", void 0);
Category = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity()
], Category);
exports.Category = Category;
var Type;
(function (Type) {
    Type["INCOME"] = "income";
    Type["EXPENSE"] = "expense";
})(Type = exports.Type || (exports.Type = {}));
var CategoryName;
(function (CategoryName) {
    CategoryName["SHARED_GIFT"] = "gift";
    CategoryName["SHARED_OTHER"] = "other";
    CategoryName["INCOME_INVESTMENT"] = "investment";
    CategoryName["INCOME_SALARY"] = "salary";
    CategoryName["EXPENSE_BAR"] = "bar";
    CategoryName["EXPENSE_CHARITY"] = "charity";
    CategoryName["EXPENSE_DINING"] = "dining";
    CategoryName["EXPENSE_ENTERTAINMENT"] = "entertainment";
    CategoryName["EXPENSE_GYM"] = "gym";
    CategoryName["EXPENSE_HEALTH"] = "health";
    CategoryName["EXPENSE_HOME"] = "home";
    CategoryName["EXPENSE_LEARNING"] = "learning";
    CategoryName["EXPENSE_PET"] = "pet";
    CategoryName["EXPENSE_SHOPPING"] = "shopping";
    CategoryName["EXPENSE_SUPERMARKET"] = "supermarket";
    CategoryName["EXPENSE_TRAVEL"] = "travel";
    CategoryName["EXPENSE_VEHICLE"] = "vehicle";
})(CategoryName = exports.CategoryName || (exports.CategoryName = {}));
//# sourceMappingURL=Category.js.map