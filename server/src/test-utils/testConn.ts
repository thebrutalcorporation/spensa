import { MikroORM } from "@mikro-orm/core";
import { exec } from "child_process";
import { BaseEntity } from "../entities/BaseEntity";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

export const testConn = () => {
  exec(`createdb spensa-test`); //TODO: use env/config variables

  return MikroORM.init({
    clientUrl: "postgresql://charlieastrada@localhost:5432/spensa-test", //TODO: use env variables
    // debug: process.env.NODE_ENV !== "production",
    entities: [BaseEntity, Transaction, User],
    type: "postgresql",
  });
};
