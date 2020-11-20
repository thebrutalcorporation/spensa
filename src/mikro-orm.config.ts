import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { BaseEntity } from "./entities/BaseEntity";

export default {
  clientUrl: "postgresql://charlieastrada@localhost:5432/spensa",
  debug: process.env.NODE_ENV !== "production",
  entities: [Post, BaseEntity],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];
