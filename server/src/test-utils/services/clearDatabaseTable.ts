import {
  Connection,
  EntityName,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";

export const clearDatabaseTable = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
  entity: EntityName<{}>
) => {
  const records = await orm.em.find(entity, {});

  for (const record of records) {
    await orm.em.remove(record);
  }
  await orm.em.flush();
};
