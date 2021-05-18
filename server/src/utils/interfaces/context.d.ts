import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type Context = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  redis: Redis;
  req: Request;
  res: Response;
};
