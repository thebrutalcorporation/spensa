import { Migration } from '@mikro-orm/migrations';

export class Migration20201120035434 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("uuid" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("uuid");');
  }

}
