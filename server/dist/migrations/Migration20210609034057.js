"use strict";
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
exports.Migration20210609034057 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210609034057 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('alter table "transaction" add column "amount" int4 not null, add column "currency" text check ("currency" in (\'usd\', \'euro\', \'ars\')) not null, add column "details" varchar(255) null, add column "is_discretionary" bool not null default true, add column "txn_date" timestamptz(0) not null, add column "type" text check ("type" in (\'income\', \'expense\')) not null;');
        });
    }
}
exports.Migration20210609034057 = Migration20210609034057;
//# sourceMappingURL=Migration20210609034057.js.map