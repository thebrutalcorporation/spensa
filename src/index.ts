import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  //   const posts = await orm.em.find(Post, {});
  //   console.log(posts);

  //   const post = orm.em.create(Post, { title: "first post" });
  //   await orm.em.persistAndFlush(post);
};

main().catch((err) => console.log(err));
