import { HelloResolver } from "../resolvers/hello";
import { TransactionResolver } from "../resolvers/transaction";
import { buildSchema } from "type-graphql";

export const createSchema = () => {
  return buildSchema({
    resolvers: [HelloResolver, TransactionResolver],
    validate: false,
  });
};
