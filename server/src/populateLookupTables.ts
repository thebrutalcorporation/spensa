import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Category, CategoryName } from "./entities/Category";

export const populateLookupTables = async (
  orm: MikroORM<IDatabaseDriver<Connection>>
): Promise<void> => {
  //don't do anything if the table is already populated as we only want to populate once.
  const categories = await orm.em.find(Category, {});
  if (categories.length > 0) {
    return;
  }
  try {
    const categories = [];
    for (const category in CategoryName) {
      if (category.includes("SHARED")) {
        categories.push(
          orm.em.create(Category, {
            type: "income",
            name: CategoryName[category as keyof typeof CategoryName],
          })
        );
        categories.push(
          orm.em.create(Category, {
            type: "expense",
            name: CategoryName[category as keyof typeof CategoryName],
          })
        );
      } else if (category.includes("EXPENSE")) {
        categories.push(
          orm.em.create(Category, {
            type: "expense",
            name: CategoryName[category as keyof typeof CategoryName],
          })
        );
      } else if (category.includes("INCOME")) {
        categories.push(
          orm.em.create(Category, {
            type: "income",
            name: CategoryName[category as keyof typeof CategoryName],
          })
        );
      }
    }

    await orm.em.persistAndFlush(categories);
  } catch (error) {
    console.error("📌 Could not populate the database", error);
    throw Error(error);
  }
};
