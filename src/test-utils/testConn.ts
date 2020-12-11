import { BaseEntity, MikroORM } from "@mikro-orm/core";
import { exec } from "child_process";
import path from "path";
import { Transaction } from "../entities/Transaction";

export const testConn = () => {
  exec(`createdb spensa-test`); //TODO: use env/config variables

  return MikroORM.init({
    clientUrl: "postgresql://charlieastrada@localhost:5432/spensa-test",
    // debug: process.env.NODE_ENV !== "production",
    entities: [Transaction, BaseEntity],
    migrations: {
      path: path.join(__dirname, "./migrations"),
      pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    type: "postgresql",
  });
};
