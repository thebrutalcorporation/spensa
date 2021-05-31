import argon2 from "argon2";
import { User } from "../../entities/User";
import { createUserOptions, IUserOptions } from "./createUserOptions";
import { MikroORM, IDatabaseDriver, Connection } from "@mikro-orm/core";

const createUser = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
  userOptions?: IUserOptions
): Promise<User> => {
  const user = orm.em.create(User, userOptions || (await createUserOptions()));
  user.password = await argon2.hash(user.password);

  // setting temporary id for test purposes
  // user.id = createSimpleUuid(index + 1);
  await orm.em.persistAndFlush(user);

  return user;
};

export default createUser;
