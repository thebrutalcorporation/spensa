import faker from "faker/locale/es";

interface ITxnOptions {
  title: string;
}

export function createTxnOptions(): ITxnOptions {
  const title = faker.company.companyName();

  return {
    title,
  };
}
