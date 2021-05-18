import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { createTestClient, TestQuery } from "apollo-server-integration-testing";
import "dotenv/config";
import faker from "faker/locale/es";
import { Server } from "http";
import "reflect-metadata";
import Application from "../application";
import { Transaction } from "../entities/Transaction";
import { TXN_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";
import { clearDatabase } from "../test-utils/services/clearDatabase";
import { loadFixtures } from "../test-utils/services/loadFixtures";

let serverConnection: Server;
let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let testClientQuery: TestQuery;
let testClientMutate: TestQuery;

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should create a txn successfully", async () => {
      //ARRANGE
      const txnToBeCreatedVariables = {
        title: faker.company.companyName(),
      };

      //ACT

      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: txnToBeCreatedVariables,
        }
      );

      let newlyCreatedTxn: Transaction = (response.data as any)
        ?.createTransaction;

      //ASSERT
      let dbTxn = await em.findOne(Transaction, {
        id: newlyCreatedTxn.id,
      });
      expect(newlyCreatedTxn.id).toBe(dbTxn?.id);
    });

    test("should return all transactions", async () => {
      //ARRANGE
      //create 2 txns with diff titles
      await testClientMutate(TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
        variables: {
          title: faker.company.companyName(),
        },
      });

      await testClientMutate(TXN_QUERIES_AND_MUTATIONS.CREATE_TXN, {
        variables: {
          title: faker.company.companyName(),
        },
      });

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
      //create a new txn
      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: {
            title: faker.company.companyName(),
          },
        }
      );

      const newlyCreatedTxn = (response.data as any)?.createTransaction;

      //ACT
      //query txn by id
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.GET_TXN, {
        variables: { id: newlyCreatedTxn.id },
      });

      const returnedTxn = (res.data as any).transaction;

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
      //create a new txn
      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: {
            title: faker.company.companyName(),
          },
        }
      );

      const newlyCreatedTxn = (response.data as any).createTransaction;

      //new title we will use to update txn
      const newTitle = faker.company.companyName();

      //ACT
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.UPDATE_TXN, {
        variables: { id: newlyCreatedTxn.id, title: newTitle },
      });

      const updatedTxn: Transaction = (res.data as any).updateTransaction;

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
      //create a new txn to delete
      const response = await testClientMutate(
        TXN_QUERIES_AND_MUTATIONS.CREATE_TXN,
        {
          variables: {
            title: faker.company.companyName(),
          },
        }
      );

      const newlyCreatedTxn = (response.data as any).createTransaction;

      //ACT
      //Delete txn by id
      const res = await testClientQuery(TXN_QUERIES_AND_MUTATIONS.DELETE_TXN, {
        variables: { id: newlyCreatedTxn.id },
      });
      const isTxnDeleted: Boolean = (res.data as any).deleteTransaction;

      //should be undefined after deletion
      const [dbTxn] = await em.find(Transaction, { id: newlyCreatedTxn.id });

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
  await clearDatabase(orm);
  await loadFixtures(orm);
});

afterAll(async () => {
  await orm.close();
  serverConnection.close();
});
