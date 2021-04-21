import {
  createTestClient,
  ApolloServerTestClient,
} from "apollo-server-testing";

import "reflect-metadata";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import faker from "faker/locale/es";
import { testConn } from "../test-utils/testConn";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "../utils/createSchema";
import { Transaction } from "../entities/Transaction";
import { TXN_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";

let dbConn: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let server: ApolloServerTestClient;

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should create a txn successfully", async () => {
      //ARRANGE
      const txnToBeCreatedVariables = {
        title: faker.company.companyName(),
      };

      //ACT
      const { mutate } = server;
      const response = await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: txnToBeCreatedVariables,
      });

      let newlyCreatedTxn: Transaction = response.data.createTransaction;
      //API returns timestamp as unix in string format. We need to get a proper date format for comparison
      newlyCreatedTxn.createdAt = new Date(Number(newlyCreatedTxn.createdAt));
      newlyCreatedTxn.updatedAt = new Date(Number(newlyCreatedTxn.updatedAt));

      let dbTxn = await em.findOne(Transaction, {
        id: newlyCreatedTxn.id,
      });

      //to remove wrappers to objects that would cause our comparison to fail
      newlyCreatedTxn = JSON.parse(JSON.stringify(newlyCreatedTxn));
      dbTxn = JSON.parse(JSON.stringify({ ...dbTxn }));

      //ASSERT
      expect(newlyCreatedTxn).toEqual(dbTxn); //API returned object equal to object in database?
    });

    test("should return all transactions", async () => {
      //ARRANGE
      const { query, mutate } = server;

      //create 2 txns with diff titles
      await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: {
          title: faker.company.companyName(),
        },
      });

      await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: {
          title: faker.company.companyName(),
        },
      });

      //ACT
      const res = await query({
        query: TXN_QUERIES_AND_MUTATIONS.GET_ALL_TXNS,
      });
      const transactions: Transaction[] = res.data.transactions;

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
      const { query, mutate } = server;

      //create a new txn
      const response = await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: {
          title: faker.company.companyName(),
        },
      });

      const newlyCreatedTxn = response.data.createTransaction;

      //ACT
      //query txn by id
      const res = await query({
        query: TXN_QUERIES_AND_MUTATIONS.GET_TXN,
        variables: { id: newlyCreatedTxn.id },
      });

      const returnedTxn = res.data.transaction;

      //query txn directly from db
      const [dbTxn]: Transaction[] = await em.find(Transaction, {
        id: newlyCreatedTxn.id,
      });

      //ASSERT
      expect(returnedTxn.id).toBe(newlyCreatedTxn.id);
      expect(returnedTxn.title).toBe(newlyCreatedTxn.title);
      expect(returnedTxn.id).toBe(dbTxn.id);
      expect(returnedTxn.title).toBe(dbTxn.title);
    });
    test("should update a transaction", async () => {
      //ARRANGE
      const { query, mutate } = server;

      //create a new txn
      const response = await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: {
          title: faker.company.companyName(),
        },
      });

      const newlyCreatedTxn = response.data.createTransaction;

      //new title we will use to update txn
      const newTitle = faker.company.companyName();

      //ACT
      const res = await query({
        query: TXN_QUERIES_AND_MUTATIONS.UPDATE_TXN,
        variables: { id: newlyCreatedTxn.id, title: newTitle },
      });

      const updatedTxn: Transaction = res.data.updateTransaction;

      //query txn directly from db
      const [dbTxn] = await em.find(Transaction, { id: updatedTxn.id });

      //ASSERT
      expect(updatedTxn.id).toBe(newlyCreatedTxn.id); //check same transaction
      expect(updatedTxn.title).not.toBe(newlyCreatedTxn.title); //we changed title so should not match
      expect(updatedTxn.id).toBe(dbTxn?.id); //check for sameness with dbTxn
      expect(updatedTxn.title).toBe(dbTxn.title);
      expect(dbTxn.title).not.toBe(newlyCreatedTxn.title); //we changed title so should not match
    });
    test("should delete a transaction", async () => {
      //ARRANGE
      const { query, mutate } = server;

      //create a new txn to delete
      const response = await mutate({
        mutation: TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        variables: {
          title: faker.company.companyName(),
        },
      });

      const newlyCreatedTxn = response.data.createTransaction;

      //ACT
      //Delete txn by id
      const res = await query({
        query: TXN_QUERIES_AND_MUTATIONS.DELETE_TXN,
        variables: { id: newlyCreatedTxn.id },
      });
      const isTxnDeleted: Boolean = res.data.deleteTransaction;

      //should be undefined after deletion
      const [dbTxn] = await em.find(Transaction, { id: newlyCreatedTxn.id });

      //ASSERT
      expect(isTxnDeleted).toBe(true);
      expect(dbTxn).toBe(undefined);
    });
  });
});

beforeAll(async () => {
  //set up database connection
  dbConn = await testConn();
  em = dbConn.em;

  //Setup an Apollo test server
  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: () => ({ em }),
  });

  server = createTestClient(apolloServer);
});

beforeEach(async () => {
  await em.nativeDelete(Transaction, {}); //clear all txns in test db
});

afterAll(async () => {
  await dbConn.close();
});
