import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";
import faker from "faker/locale/es";
import { Category } from "../../entities/Category";
import { Currency, Type } from "../../entities/Transaction";
import { getRandomIntInclusive } from "../helpers/getRandomIntInclusive";

interface ITxnOptions {
  amount: number;
  category: string;
  currency: string;
  details?: string;
  isDiscretionary: boolean;
  title: string;
  txnDate: string;
  type: string;
}

export async function createTxnOptions(
  orm: MikroORM<IDatabaseDriver<Connection>>
): Promise<ITxnOptions> {
  const em = orm.em.fork();
  const categories = await em.find(Category, {});
  const amount = Number(faker.finance.amount()) * 100; //multiply by 100 to convert dollars to cents and store as integer
  const currency = getRandomItemFromObject(Currency);
  const details = faker.commerce.productDescription();
  const isDiscretionary = faker.datatype.boolean();
  const title = faker.company.companyName();
  const txnDate = faker.date.recent().toISOString();
  const type = getRandomItemFromObject(Type);
  const filteredCategories = categories.filter(
    (category) => category.type === type
  );
  const category = getRandomItemFromArray(filteredCategories as [])
    .id as string;

  return {
    amount,
    category,
    currency,
    details,
    isDiscretionary,
    title,
    txnDate,
    type,
  };
}

function getRandomItemFromObject(object: Record<string, unknown>) {
  return Object.keys(object)[
    getRandomIntInclusive(0, Object.keys(object).length - 1)
  ].toLowerCase();
}

function getRandomItemFromArray(arr: []): Record<string, unknown> {
  return arr[Math.floor(Math.random() * arr.length)];
}
