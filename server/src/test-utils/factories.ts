import faker from "faker/locale/es";

export function genUserOptions() {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const fullName = `${firstName}_${lastName}`;
  const password = faker.internet.password();
  const email = faker.internet.email();

  return {
    username: fullName,
    password,
    email,
  };
}
