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
exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const BaseEntity_1 = require("./BaseEntity");
const uuid_1 = require("uuid");
const Transaction_1 = require("./Transaction");
let User = class User extends BaseEntity_1.BaseEntity {
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
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    core_1.Property({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => [Transaction_1.Transaction]),
    core_1.OneToMany(() => Transaction_1.Transaction, (transaction) => transaction.user, {
        cascade: [core_1.Cascade.ALL],
    }),
    __metadata("design:type", Object)
], User.prototype, "transactions", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map