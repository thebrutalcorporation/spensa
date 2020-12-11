import "reflect-metadata";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { gqlCall } from "../test-utils/gqlCall";
import { testConn } from "../test-utils/testConn";

let conn: MikroORM<IDatabaseDriver<Connection>>;

beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const helloQuery = `
query {
  hello 
}
`;

describe("hello resolver", () => {
  test("should say hello world ", async () => {
    // expect(true).toBe(true);

    const expected = "hello world";

    const result = await gqlCall({
      source: helloQuery,
    });

    expect(result.data?.hello).toBe(expected);
  });
});
