import { Transaction } from "../entities/Transaction";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../utils/interfaces/context";

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

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("title") title: string,
    @Ctx() { em }: Context
  ): Promise<Transaction> {
    const transaction = em.create(Transaction, { title });
    await em.persistAndFlush(transaction);

    return transaction;
  }

  @Mutation(() => Transaction, { nullable: true })
  async updateTransaction(
    @Arg("id") id: string,
    @Arg("title") title: string,
    @Ctx() { em }: Context
  ): Promise<Transaction | null> {
    const transaction = await em.findOne(Transaction, { id });
    if (!transaction) {
      return null;
    }

    if (typeof title != undefined && title !== transaction.title) {
      transaction.title = title;
      await em.persistAndFlush(transaction);
    }

    return transaction;
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id") id: string,
    @Ctx() { em }: Context
  ): Promise<boolean> {
    const transaction = await em.findOne(Transaction, { id });
    if (!transaction) {
      return false;
    }

    await em.removeAndFlush(transaction);

    return true;
  }
}
