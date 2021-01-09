import { TransactionResolver } from "../resolvers/transaction";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/user";

export const createSchema = () => {
  return buildSchema({
    resolvers: [TransactionResolver, UserResolver],
    validate: false,
  });
};
