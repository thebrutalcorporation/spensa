import { Migration } from '@mikro-orm/migrations';

export class Migration20201126195100 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "transaction" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
    this.addSql('alter table "transaction" add constraint "transaction_pkey" primary key ("id");');
  }

}
