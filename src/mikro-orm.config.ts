import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { BaseEntity } from "./entities/BaseEntity";
import { Transaction } from "./entities/Transaction";

export default {
  clientUrl: "postgresql://charlieastrada@localhost:5432/spensa",
  debug: process.env.NODE_ENV !== "production",
  entities: [Transaction, BaseEntity],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];
