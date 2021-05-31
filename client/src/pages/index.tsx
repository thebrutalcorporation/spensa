import { Box } from "@chakra-ui/layout";
import React from "react";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useAllTransactionsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = useAllTransactionsQuery();
  return (
    <Layout>
      <NextLink href="/create-txn">
        <Link>Create Transaction</Link>
      </NextLink>
      <div>Hello World!</div>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.transactions.map((transaction) => (
          <div key={transaction.id}>{transaction.title}</div>
        ))
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
