import { Field, InputType } from "type-graphql";
import { Currency, Type } from "../../entities/Transaction";

@InputType()
export class TransactionInput {
  @Field()
  amount!: number;

  @Field()
  category!: string;

  @Field()
  currency!: Currency;

  @Field({ nullable: true })
  details!: string;

  @Field()
  isDiscretionary!: boolean;

  @Field()
  title!: string;

  @Field()
  txnDate!: Date;

  @Field()
  type!: Type;
}
