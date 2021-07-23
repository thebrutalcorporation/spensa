import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { BaseEntity } from "./entities/BaseEntity";
import { Category } from "./entities/Category";
import { Transaction } from "./entities/Transaction";
import { User } from "./entities/User";

export default {
  entities: [BaseEntity, Category, Transaction, User],
  clientUrl: "postgresql://charlieastrada@localhost:5432/spensa",
  // debug: process.env.NODE_ENV !== "production",
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];
