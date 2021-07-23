import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "./BaseEntity";
import { v4 } from "uuid";
import { Transaction, Type } from "./Transaction";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Field()
  @Enum(() => Type)
  type!: Type;

  @Field()
  @Enum(() => CategoryName)
  name!: CategoryName;

  @Field(() => [Transaction])
  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions = new Collection<Transaction>(this);
}

export enum CategoryName {
  //SHARED
  SHARED_GIFT = "gift",
  SHARED_OTHER = "other",
  //for INCOME type
  INCOME_INVESTMENT = "investment",
  INCOME_SALARY = "salary",
  //for EXPENSE type
  EXPENSE_BAR = "bar",
  EXPENSE_CHARITY = "charity",
  EXPENSE_DINING = "dining",
  EXPENSE_ENTERTAINMENT = "entertainment",
  EXPENSE_GYM = "gym",
  EXPENSE_HEALTH = "health",
  EXPENSE_HOME = "home",
  EXPENSE_LEARNING = "learning",
  EXPENSE_PET = "pet",
  EXPENSE_SHOPPING = "shopping",
  EXPENSE_SUPERMARKET = "supermarket",
  EXPENSE_TRAVEL = "travel",
  EXPENSE_VEHICLE = "vehicle",
}
