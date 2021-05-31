import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "./BaseEntity";
import { v4 } from "uuid";
import { Transaction } from "./Transaction";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: [Cascade.ALL],
  })
  transactions = new Collection<Transaction>(this);
}
