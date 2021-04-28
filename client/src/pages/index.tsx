import { Box } from "@chakra-ui/layout";
import React from "react";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useAllTransactionsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = useAllTransactionsQuery();
  return (
    <Box>
      <NavBar />
      <Box>
        <div>Hello World!</div>
        <br />
        {!data ? (
          <div>loading...</div>
        ) : (
          data.transactions.map((transaction) => (
            <div key={transaction.id}>{transaction.title}</div>
          ))
        )}
      </Box>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
