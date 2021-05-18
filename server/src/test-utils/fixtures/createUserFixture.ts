import argon2 from "argon2";
import faker from "faker/locale/es";

export async function createUserFixture() {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const fullName = `${firstName}_${lastName}`;
  const textPwd = faker.internet.password();
  const password = await argon2.hash(textPwd);
  const email = faker.internet.email().toLowerCase();

  return {
    username: fullName,
    password,
    email,
  };
}
