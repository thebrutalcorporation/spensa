import { User } from "../../entities/User";
import { createTxnOptions } from "./createTxnOptions";
import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Transaction } from "../../entities/Transaction";

const createTxn = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,

  userId: string
): Promise<Transaction> => {
  const em = orm.em.fork();
  const txn = em.create(Transaction, await createTxnOptions(orm));

  // setting temporary id for test purposes
  // txn.id = createSimpleUuid(index + 1);
  txn.user = em.getRepository(User).getReference(userId);

  await em.persistAndFlush(txn);
  return txn;
};

export default createTxn;
