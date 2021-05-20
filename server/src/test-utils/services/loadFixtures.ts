import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import { createUserFixture } from "../fixtures/createUserFixture";
import { createTxnFixture } from "../fixtures/createTxnFixture";
import createSimpleUuid from "../helpers/createSimpleUuid";

export const loadFixtures = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
  fixtureSet: "all" | "user" | "transaction"
): Promise<void> => {
  try {
    if (fixtureSet === "user" || fixtureSet === "all") {
      await Promise.all(
        [...Array(5)].map(async (_, userIndex) => {
          const user = orm.em.create(User, await createUserFixture());
          // setting temporary id for test purposes
          user.id = createSimpleUuid(userIndex + 1);

          await orm.em.persist(user);
          return user;
        })
      );
    }

    if (fixtureSet === "transaction" || fixtureSet === "all") {
      await Promise.all(
        [...Array(5)].map(async (_, txnIndex) => {
          const txn = orm.em.create(Transaction, createTxnFixture());

          // setting temporary id for test purposes
          txn.id = createSimpleUuid(txnIndex + 1);
          // txn.user = orm.em.getRepository(User).getReference(users[txnIndex].id);

          await orm.em.persist(txn);
          return txn;
        })
      );
    }

    await orm.em.flush();
  } catch (error) {
    console.error("📌 Could not load fixtures", error);
  }
};
