import faker from "faker";
faker.locale = "es";

export function genUserOptions() {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const fullName = `${firstName}_${lastName}`;
  const password = faker.internet.password();

  return {
    username: fullName,
    password,
  };
}
