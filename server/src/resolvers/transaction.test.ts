/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { createTestClient, TestQuery } from "apollo-server-integration-testing";
import { doesNotReject } from "assert";
import "dotenv/config";
import faker from "faker/locale/es";
import { Server } from "http";
import "reflect-metadata";
import Application from "../application";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import createTxn from "../test-utils/fixtures/createTxn";
import { createTxnOptions } from "../test-utils/fixtures/createTxnOptions";
import createUser from "../test-utils/fixtures/createUser";
import { TXN_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";
import { clearDatabaseTable } from "../test-utils/services/clearDatabaseTable";

let serverConnection: Server;
let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let testClientQuery: TestQuery;
let testClientMutate: TestQuery;

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should create a txn successfully", async () => {
      //ARRANGE
      const user = await createUser(orm);
      const txn = createTxnOptions();
      const txnToBeCreated = { ...txn, userId: user.id };

      //ACT

      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: txnToBeCreated,
        }
      );

      const newlyCreatedTxn: Transaction = (response.data as any)
        ?.createTransaction;

      //ASSERT
      const dbTxn = await em.findOne(Transaction, {
        id: newlyCreatedTxn.id,
      });
      expect(newlyCreatedTxn.id).toBe(dbTxn?.id);
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
});

beforeAll(async () => {
  const application = Application();
  await application.connect();
  await application.init();
  orm = await application.getOrm();
  const apolloServer = await application.getApolloServer();

  // make available to other scopes
  serverConnection = await application.getServerConnection();
  serverConnection.close();
  em = orm.em.fork();

  //generate a user and set the req.sessiono.id to user.id to simulate logged in user
  // const user = await createUser(orm, getRandomInt(1, 1000));
  const { query, mutate } = createTestClient({
    apolloServer,
    extendMockRequest: {
      session: {
        userId: null,
      },
    },
  });

  //Set values to variables for use in other tests
  testClientMutate = mutate;
  testClientQuery = query;
});

beforeEach(async () => {
  await clearDatabaseTable(orm, Transaction);
  await clearDatabaseTable(orm, User);
});

afterAll(async () => {
  await clearDatabaseTable(orm, Transaction);
  await clearDatabaseTable(orm, User);
  await orm.close();
  await serverConnection.close();
});
