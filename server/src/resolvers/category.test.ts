/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { createTestClient, TestQuery } from "apollo-server-integration-testing";
import "dotenv/config";
import "reflect-metadata";
import Application from "../application";
import { Category } from "../entities/Category";
import { CATEGORY_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";

let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let testClientQuery: TestQuery;

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should return all categories", async () => {
      //ARRANGE

      //ACT
      const res = await testClientQuery(
        CATEGORY_QUERIES_AND_MUTATIONS.GET_ALL_CATEGORIES
      );
      const categories: Category[] = (res.data as any)?.categories;

      //query all categories directly from db
      const dbCategories = await em.find(Category, {});

      //ASSERT
      categories.forEach((category: Category) => {
        const matchingCategory = dbCategories.filter(
          (dbCategory) => dbCategory.id === category.id
        )[0];

        expect(category.id).toEqual(matchingCategory.id);
        expect(category.name).toEqual(matchingCategory.name);
        expect(category.type).toEqual(matchingCategory.type);
      });
    });
  });
});

beforeAll(async () => {
  const application = Application();
  await application.connect();
  await application.init();
  orm = await application.getOrm();
  const apolloServer = await application.getApolloServer();

  // make available to other scopes
  em = orm.em.fork();

  //generate a user and set the req.sessiono.id to user.id to simulate logged in user
  // const user = await createUser(orm, getRandomInt(1, 1000));
  const { query } = createTestClient({
    apolloServer,
  });

  //Set values to variables for use in other tests
  testClientQuery = query;
});

beforeEach(async () => {
  jest.resetAllMocks();
});

afterAll(async () => {
  await orm.close();
});
