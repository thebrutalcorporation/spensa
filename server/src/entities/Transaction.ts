import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "./BaseEntity";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Field()
  @Property()
  amount!: number;

  //TODO: create an entity for category options with type = {income | expense}

  @Field()
  @Enum(() => Currency)
  currency!: Currency; // string enum

  @Field()
  @Property({ nullable: true })
  details: string;

  @Field()
  @Property({ default: true })
  isDiscretionary!: boolean;

  //TODO: add recurrence https://vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/

  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field(() => String)
  @Property({ type: "date" })
  txnDate!: Date;

  @Field()
  @Enum(() => Type)
  type!: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "cascade" })
  user!: User;
}

export enum Currency {
  USD = "usd",
  EURO = "euro",
  ARS = "ars",
}

export enum Type {
  INCOME = "income",
  EXPENSE = "expense",
}
