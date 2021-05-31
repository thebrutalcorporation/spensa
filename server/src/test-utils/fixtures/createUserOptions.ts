import faker from "faker/locale/es";

export interface IUserOptions {
  username: string;
  password: string;
  email: string;
}

export function createUserOptions(): IUserOptions {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const fullName = `${firstName}_${lastName}`;
  const password = faker.internet.password();
  const email = faker.internet.email().toLowerCase();

  return {
    username: fullName,
    password,
    email,
  };
}
