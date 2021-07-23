import { Migration } from "@mikro-orm/migrations";

export class Migration20210705180458 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table \"category\" (\"id\" uuid not null, \"created_at\" timestamptz(0) not null, \"updated_at\" timestamptz(0) not null, \"type\" text check (\"type\" in ('income', 'expense')) not null, \"name\" text check (\"name\" in ('gift', 'other', 'investment', 'salary', 'bar', 'charity', 'dining', 'entertainment', 'gym', 'health', 'home', 'learning', 'pet', 'shopping', 'supermarket', 'travel', 'vehicle')) not null);"
    );
    this.addSql(
      'alter table "category" add constraint "category_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "transaction" add column "category_id" uuid not null;'
    );

    this.addSql(
      'alter table "transaction" add constraint "transaction_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;'
    );
  }
}
