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
exports.Migration20210705180458 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210705180458 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql("create table \"category\" (\"id\" uuid not null, \"created_at\" timestamptz(0) not null, \"updated_at\" timestamptz(0) not null, \"type\" text check (\"type\" in ('income', 'expense')) not null, \"name\" text check (\"name\" in ('gift', 'other', 'investment', 'salary', 'bar', 'charity', 'dining', 'entertainment', 'gym', 'health', 'home', 'learning', 'pet', 'shopping', 'supermarket', 'travel', 'vehicle')) not null);");
            this.addSql('alter table "category" add constraint "category_pkey" primary key ("id");');
            this.addSql('alter table "transaction" add column "category_id" uuid not null;');
            this.addSql('alter table "transaction" add constraint "transaction_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
        });
    }
}
exports.Migration20210705180458 = Migration20210705180458;
//# sourceMappingURL=Migration20210705180458.js.map