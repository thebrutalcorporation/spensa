import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import "dotenv-safe/config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const port = parseInt(process.env.PORT);
  const app = express();

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

main().catch((err) => console.log(err));
