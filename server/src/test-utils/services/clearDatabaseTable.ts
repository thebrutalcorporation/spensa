import {
  Connection,
  EntityName,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";

export const clearDatabaseTable = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
  entity: EntityName<Transaction | User>
): Promise<void> => {
  const records = await orm.em.find(entity, {});

  for (const record of records) {
    await orm.em.remove(record);
  }
  await orm.em.flush();
};
