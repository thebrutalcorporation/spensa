import { Transaction } from "../entities/Transaction";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "src/types/context";

@Resolver()
export class TransactionResolver {
  @Query(() => [Transaction])
  transactions(@Ctx() { em }: Context): Promise<Transaction[]> {
    return em.find(Transaction, {});
  }

  @Query(() => Transaction, { nullable: true })
  transaction(
    @Arg("id", () => String) id: string,
    @Ctx() { em }: Context
  ): Promise<Transaction | null> {
    return em.findOne(Transaction, { id });
  }
}
