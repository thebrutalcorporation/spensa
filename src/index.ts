import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const port = parseInt(process.env.PORT);
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app }); //create graphql endpoint on express

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

main().catch((err) => console.log(err));
