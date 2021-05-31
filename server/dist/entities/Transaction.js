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
exports.Transaction = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const BaseEntity_1 = require("./BaseEntity");
const uuid_1 = require("uuid");
const User_1 = require("./User");
let Transaction = class Transaction extends BaseEntity_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = uuid_1.v4();
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    core_1.PrimaryKey({ type: "uuid" }),
    __metadata("design:type", Object)
], Transaction.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    core_1.Property({ type: "text" }),
    __metadata("design:type", String)
], Transaction.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    core_1.ManyToOne(() => User_1.User, { onDelete: "cascade" }),
    __metadata("design:type", User_1.User)
], Transaction.prototype, "user", void 0);
Transaction = __decorate([
    type_graphql_1.ObjectType(),
    core_1.Entity()
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map