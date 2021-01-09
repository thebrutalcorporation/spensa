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
import faker from "faker";
import { testConn } from "../test-utils/testConn";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "../utils/createSchema";
import { Transaction } from "../entities/Transaction";

let dbConn: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let server: ApolloServerTestClient;
let seededTxn: Transaction;

const queriesAndMutations = {
  GET_ALL_TXNS: `query allTransactions{
  transactions {
    id
    title
    createdAt
    updatedAt

  }
}`,
  CREATE_TXN: `mutation createTransaction($title:String!){
  createTransaction(title:$title) {
    id
    title
    createdAt
    updatedAt
  }
}`,
  GET_TXN: `query getTransactionById($id:String!) {
  transaction(id:$id){
    id
    title
    createdAt
    updatedAt
  }
}`,
  UPDATE_TXN: `mutation updateTransaction($id:String!, $title:String!){
  updateTransaction(id:$id ,title:$title){
    id
    title
    createdAt
    updatedAt
  }
}`,
  DELETE_TXN: `mutation deleteTransaction($id:String!){
  deleteTransaction(id:$id)
}`,
};

//spanish locale for faker to test accents, etc
faker.locale = "es";

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

  //Seed with single txn as all tests will need at least 1 txn.
  const { mutate } = server;
  const response = await mutate({
    mutation: queriesAndMutations.CREATE_TXN,
    variables: {
      title: faker.company.companyName(),
    },
  });

  seededTxn = response.data?.createTransaction;
});

afterAll(async () => {
  await em.nativeDelete(Transaction, {}); //clear all txns in test db
  await dbConn.close();
});

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
        mutation: queriesAndMutations.CREATE_TXN,
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
      //arrange
      const { query } = server;

      //act
      const res = await query({ query: queriesAndMutations.GET_ALL_TXNS });
      const transactions: Transaction[] = res.data.transactions;
      //query all txns directly from db
      const dbTxns = await em.find(Transaction, {});

      //assert
      transactions.forEach((transaction: Transaction) => {
        const matchingDbTxn = dbTxns.filter(
          (dbTxn) => dbTxn.id === transaction.id
        )[0];

        expect(transaction.title).toEqual(matchingDbTxn.title);
      });
    });
    test("should return a transaction by id", async () => {
      //arrange
      const { query } = server;
      const seededTxnId = seededTxn.id;
      const seededTxnTitle = seededTxn.title;

      //act
      const res = await query({
        query: queriesAndMutations.GET_TXN,
        variables: { id: seededTxnId },
      });

      const transaction = res.data.transaction;

      //query txn directly from db
      const [dbTxn]: Transaction[] = await em.find(Transaction, {
        id: seededTxnId,
      });

      //assert
      expect(transaction.id).toBe(seededTxn.id);
      expect(transaction.title).toBe(seededTxnTitle);
      expect(transaction.id).toBe(dbTxn.id);
      expect(transaction.title).toBe(dbTxn.title);
    });
    test("should update a transaction", async () => {
      //arrange
      const { query } = server;
      const seededTxnId = seededTxn.id;
      const seededTxnTitle = seededTxn.title;
      const newTitle = faker.company.companyName();

      //act
      const res = await query({
        query: queriesAndMutations.UPDATE_TXN,
        variables: { id: seededTxnId, title: newTitle },
      });

      const updatedTxn: Transaction = res.data.updateTransaction;

      //query txn directly from db
      const [dbTxn] = await em.find(Transaction, { id: seededTxnId });

      // console.log(transaction)
      // console.log(dbTxn)

      //assert
      expect(updatedTxn.id).toBe(seededTxn.id); //check same transaction
      expect(updatedTxn.title).not.toBe(seededTxnTitle); //we changed title so should not match
      expect(updatedTxn.id).toBe(dbTxn.id); //check for sameness with dbTxn
      expect(updatedTxn.title).toBe(dbTxn.title);
      expect(dbTxn.title).not.toBe(seededTxnTitle); //we changed title so should not match
    });
    test("should delete a transaction", async () => {
      //arrange
      const { query } = server;
      const seededTxnId = seededTxn.id;

      //act
      const res = await query({
        query: queriesAndMutations.DELETE_TXN,
        variables: { id: seededTxnId },
      });
      const isTxnDeleted: Boolean = res.data.deleteTransaction;

      //should be undefined after deletion
      const [dbTxn] = await em.find(Transaction, { id: seededTxnId });

      //assert
      expect(isTxnDeleted).toBe(true);
      expect(dbTxn).toBe(undefined);
    });
  });
});
