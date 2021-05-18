import faker from "faker/locale/es";

export function createTxnFixture() {
  const title = faker.company.companyName();

  return {
    title,
  };
}
