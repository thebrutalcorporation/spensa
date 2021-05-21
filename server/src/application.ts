import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import Redis from "ioredis";
import session from "express-session";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME } from "./constants";
import ormConfig from "./orm.config";
import { Context } from "./utils/interfaces/context";
import { ApolloServer } from "apollo-server-express";
import { TransactionResolver } from "./resolvers/transaction";
import { UserResolver } from "./resolvers/user";
import { Server } from "http";
import { AddressInfo } from "node:net";

const Application = () => {
  let orm: MikroORM<IDatabaseDriver<Connection>>;
  let host: express.Application;
  let apolloServer: ApolloServer;
  let server: Server;

  const getOrm = (): Promise<MikroORM<IDatabaseDriver<Connection>>> => {
    return new Promise((resolve, reject) => {
      if (!orm) {
        reject();
      }
      resolve(orm);
    });
  };

  const getServerConnection = (): Promise<Server> => {
    return new Promise((resolve, reject) => {
      if (!server) {
        reject();
      }
      resolve(server);
    });
  };

  const getApolloServer = (): Promise<ApolloServer> => {
    return new Promise((resolve, reject) => {
      if (!apolloServer) {
        reject();
      }
      resolve(apolloServer);
    });
  };

  const connect = async (): Promise<void> => {
    try {
      orm = await MikroORM.init(ormConfig);
      const migrator = orm.getMigrator();
      const migrations = await migrator.getPendingMigrations();
      if (migrations && migrations.length > 0) {
        await migrator.up();
      }
    } catch (error) {
      console.error("📌 Could not connect to the database", error);
      throw Error(error);
    }
  };

  const init = async (): Promise<void> => {
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    host = express();

    host.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    try {
      host.use(
        session({
          name: COOKIE_NAME,
          cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
            sameSite: "lax", //csrf
            secure: process.env.NODE_ENV === "production", //only works for https
          },
          resave: false,
          saveUninitialized: false, //avoids storing empty sessions; only stores if we have data set
          secret: "supersecretkey2342", //TODO: set as env variable
          store: new RedisStore({
            client: redis,
            disableTouch: true,
          }),
        })
      );

      apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [TransactionResolver, UserResolver],
          validate: false,
        }),
        context: ({ req, res }): Context => ({ em: orm.em, req, res, redis }),
      });

      apolloServer.applyMiddleware({
        app: host,
        cors: false,
      }); //create graphql endpoint on express

      if (process.env.NODE_ENV === "test") {
        server = host.listen(0);
        const { port } = server.address() as AddressInfo;
        console.log(`Listening on ${port}`);
      } else {
        server = host.listen(4000, () => {
          console.log(`Server running on port: 4000`);
        });
      }
    } catch (error) {
      console.error("📌 Could not start server", error);
    }
  };

  return Object.freeze({
    init,
    connect,
    getOrm,
    getApolloServer,
    getServerConnection,
  });
};

export default Application;
