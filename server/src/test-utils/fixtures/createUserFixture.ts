import faker from "faker/locale/es";

export function createUserFixture() {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const fullName = `${firstName}_${lastName}`;
  const password = faker.internet.password();
  // const password = await argon2.hash(textPwd);
  const email = faker.internet.email().toLowerCase();

  return {
    username: fullName,
    password,
    email,
  };
}
