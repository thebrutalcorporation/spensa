/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import {
  createTestClient,
  TestQuery,
  TestSetOptions,
} from "apollo-server-integration-testing";
import "dotenv/config";
import faker from "faker/locale/es";
import "reflect-metadata";
import Application from "../application";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import createTxn from "../test-utils/fixtures/createTxn";
import { createTxnOptions } from "../test-utils/fixtures/createTxnOptions";
import createUser from "../test-utils/fixtures/createUser";
import { TXN_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";
import { clearDatabaseTable } from "../test-utils/services/clearDatabaseTable";

let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let testClientQuery: TestQuery;
let testClientMutate: TestQuery;
let testSetOptions: TestSetOptions;

//TODO: how  can we mock and return next()?
//see your issue: https://stackoverflow.com/questions/67768435/proper-way-to-test-type-graphql-middleware-with-jest
// jest.mock("../middleware/isAuth", () => {
//   return {
//     isAuth: jest.fn(),
//   };
// });

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should create a txn successfully", async () => {
      //ARRANGE
      const user = await createUser(orm);
      const txnToBeCreated = await createTxnOptions(orm);
      // console.log("txnToBeCreated", txnToBeCreated);

      testSetOptions({
        // If "request" or "response" is not specified, it's not modified
        request: {
          session: {
            userId: user.id,
          },
        },
      });

      //ACT
      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: { options: txnToBeCreated },
        }
      );

      const newlyCreatedTxn: Transaction = (response.data as any)
        ?.createTransaction;

      //ASSERT
      const dbTxn = await em.findOne(Transaction, {
        id: newlyCreatedTxn.id,
      });

      expect(newlyCreatedTxn.id).toBe(dbTxn?.id);
      expect(newlyCreatedTxn.amount).toBe(dbTxn?.amount);
      expect(newlyCreatedTxn.category.id).toBe(dbTxn?.category.id);
      expect(newlyCreatedTxn.currency).toBe(dbTxn?.currency);
      expect(newlyCreatedTxn.details).toBe(dbTxn?.details);
      expect(newlyCreatedTxn.isDiscretionary).toBe(dbTxn?.isDiscretionary);
      expect(newlyCreatedTxn.title).toBe(dbTxn?.title);
      expect(newlyCreatedTxn.user.id).toBe(dbTxn?.user.id);
    });

    test("should return all transactions", async () => {
      //ARRANGE
      const user = await createUser(orm);
      await Promise.all(
        [...Array(5)].map(async () => {
          return await createTxn(orm, user.id);
        })
      );

      //ACT
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.GET_ALL_TXNS);
      const transactions: Transaction[] = (res.data as any)?.transactions;

      //query all txns directly from db
      const dbTxns = await em.find(Transaction, {});

      //ASSERT
      transactions.forEach((transaction: Transaction) => {
        const matchingDbTxn = dbTxns.filter(
          (dbTxn) => dbTxn.id === transaction.id
        )[0];

        expect(transaction.title).toEqual(matchingDbTxn.title);
      });
    });
    test("should return a transaction by id", async () => {
      //ARRANGE
      const user = await createUser(orm);
      const txn = await createTxn(orm, user.id);

      //ACT
      //query txn by id
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.GET_TXN, {
        variables: { id: txn.id },
      });

      const returnedTxn = (res.data as any).transaction;

      //query txn directly from db
      const [dbTxn]: Transaction[] = await em.find(Transaction, {
        id: txn.id,
      });

      //ASSERT
      expect(returnedTxn.id).toBe(txn.id);
      expect(returnedTxn.title).toBe(txn.title);
      expect(returnedTxn.id).toBe(dbTxn.id);
      expect(returnedTxn.title).toBe(dbTxn.title);
    });
    test("should update a transaction", async () => {
      //ARRANGE
      const user = await createUser(orm);
      const txn = await createTxn(orm, user.id);
      const originalId = txn.id;
      const originalTitle = txn.title;

      //new title we will use to update txn
      const newTitle = faker.company.companyName();

      //ACT
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.UPDATE_TXN, {
        variables: { id: txn.id, title: newTitle },
      });

      const updatedTxn: Transaction = (res.data as any).updateTransaction;

      //query txn directly from db
      const [dbTxn] = await em.find(Transaction, { id: updatedTxn.id });

      //ASSERT
      expect(updatedTxn.id).toBe(originalId); //check same transaction
      expect(updatedTxn.title).not.toBe(originalTitle); //we changed title so should not match
      expect(updatedTxn.id).toBe(dbTxn?.id); //check for sameness with dbTxn
      expect(updatedTxn.title).toBe(dbTxn.title);
      expect(dbTxn.title).not.toBe(originalId); //we changed title so should not match
    });
    test("should delete a transaction", async () => {
      //ARRANGE
      //create a new txn to delete
      const user = await createUser(orm);
      const txn = await createTxn(orm, user.id);

      //ACT
      //Delete txn by id
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.DELETE_TXN, {
        variables: { id: txn.id },
      });
      const isTxnDeleted: boolean = (res.data as any).deleteTransaction;

      //should be undefined after deletion
      const [dbTxn] = await em.find(Transaction, { id: txn.id });

      //ASSERT
      expect(isTxnDeleted).toBe(true);
      expect(dbTxn).toBe(undefined);
    });
  });

  describe("Validations", () => {
    test("should return an error when creating txn when user not logged in", async () => {
      //ARRANGE
      const txnToBeCreated = await createTxnOptions(orm);
      const expectedErrorMessage = "Not authenticated!";

      //setting undefined for session.userId means user is not logged in
      testSetOptions({
        // If "request" or "response" is not specified, it's not modified
        request: {
          session: {
            userId: undefined,
          },
        },
      });

      //ACT
      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: { options: txnToBeCreated },
        }
      );

      const receivedErrorMessage = response.errors?.[0].message;

      //ASSERT
      expect(response.errors).not.toBe(null);
      expect(receivedErrorMessage).toBe(expectedErrorMessage);
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
  const { query, mutate, setOptions } = createTestClient({
    apolloServer,
  });

  //Set values to variables for use in other tests
  testClientMutate = mutate;
  testClientQuery = query;
  testSetOptions = setOptions;
});

beforeEach(async () => {
  await clearDatabaseTable(orm, Transaction);
  await clearDatabaseTable(orm, User);
  jest.resetAllMocks();
});

afterAll(async () => {
  await orm.close();
});
