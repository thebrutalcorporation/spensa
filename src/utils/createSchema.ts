import { HelloResolver } from "../resolvers/hello";
import { TransactionResolver } from "../resolvers/transaction";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/user";

export const createSchema = () => {
  return buildSchema({
    resolvers: [HelloResolver, TransactionResolver, UserResolver],
    validate: false,
  });
};
