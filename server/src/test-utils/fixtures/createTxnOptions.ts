import faker from "faker/locale/es";
import { Currency, Type } from "../../entities/Transaction";
import { getRandomIntInclusive } from "../helpers/getRandomIntInclusive";

interface ITxnOptions {
  amount: number;
  currency: string;
  details?: string;
  isDiscretionary: boolean;
  title: string;
  txnDate: string;
  type: string;
}

export function createTxnOptions(): ITxnOptions {
  const amount = Number(faker.finance.amount());
  const currency = getRandomItemFromObject(Currency);
  const details = faker.commerce.productDescription();
  const isDiscretionary = faker.datatype.boolean();
  const title = faker.company.companyName();
  const txnDate = faker.date.recent().toISOString();
  const type = getRandomItemFromObject(Type);

  return {
    amount,
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
