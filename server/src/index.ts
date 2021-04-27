import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "./utils/createSchema";
import { Context } from "./types/context";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { COOKIE_NAME } from "./constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const port = parseInt(process.env.PORT);
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
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
        client: redisClient,
        disableTouch: true,
      }),
    })
  );

  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ req, res }): Context => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  }); //create graphql endpoint on express

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

main().catch((err) => console.log(err));
