import { User } from "../../entities/User";
import { createTxnOptions } from "./createTxnOptions";
import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Transaction } from "../../entities/Transaction";

const createTxn = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,

  userId: string
): Promise<Transaction> => {
  const txn = orm.em.create(Transaction, createTxnOptions());

  // setting temporary id for test purposes
  // txn.id = createSimpleUuid(index + 1);
  txn.user = orm.em.getRepository(User).getReference(userId);

  await orm.em.persistAndFlush(txn);
  return txn;
};

export default createTxn;
