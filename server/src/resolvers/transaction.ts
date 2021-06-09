import { Transaction } from "../entities/Transaction";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Context } from "../utils/interfaces/context";
import { isAuth } from "../middleware/isAuth";
import { TransactionInput } from "./InputTypes/TransactionInput";

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
  @UseMiddleware(isAuth)
  async createTransaction(
    @Arg("options") options: TransactionInput,
    @Ctx() { em, req }: Context
  ): Promise<Transaction> {
    const transaction = em.create(Transaction, {
      amount: options.amount,
      currency: options.currency,
      details: options.details,
      isDiscretionary: options.details,
      title: options.title,
      txnDate: options.txnDate,
      type: options.type,
      user: req.session.userId,
    });
    await em.persistAndFlush(transaction);

    return transaction;
  }

  //TODO: refactor to use options input
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
