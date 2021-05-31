import { Migration } from "@mikro-orm/migrations";

export class Migration20210530215325 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "transaction" add column "user_id" uuid not null;'
    );

    this.addSql(
      'alter table "transaction" add constraint "transaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;'
    );
  }
}
