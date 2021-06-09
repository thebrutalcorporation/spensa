import { Migration } from "@mikro-orm/migrations";

export class Migration20210609034057 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "transaction" add column "amount" int4 not null, add column "currency" text check ("currency" in (\'usd\', \'euro\', \'ars\')) not null, add column "details" varchar(255) null, add column "is_discretionary" bool not null default true, add column "txn_date" timestamptz(0) not null, add column "type" text check ("type" in (\'income\', \'expense\')) not null;'
    );
  }
}
