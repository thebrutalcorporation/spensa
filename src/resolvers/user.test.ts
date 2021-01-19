import {
  createTestClient,
  ApolloServerTestClient,
} from "apollo-server-testing";

import "reflect-metadata";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import faker from "faker";
import { testConn } from "../test-utils/testConn";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "../utils/createSchema";
import { UsernamePasswordInput, UserResponse } from "./user";
import { User } from "../entities/User";

let dbConn: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let server: ApolloServerTestClient;
let seedUser: User;

const queriesAndMutations = {
  REGISTER: `mutation register($options: UsernamePasswordInput!) {
  register(options: $options) {
    user {
      id      
      username
    }
    errors {
      field
      message
    }
  }
}
`,
  LOGIN: `mutation login($options:UsernamePasswordInput!) {
  login(options:$options) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`,
};

//spanish locale for faker to test accents, etc
faker.locale = "es";

const seedUserOptions = { username: "seed", password: "seed123" };
const defaultUserOptions = { username: "test", password: "test123" };

async function registerUser(
  username = seedUserOptions.username,
  password = seedUserOptions.password
) {
  const { mutate } = server;
  const userToCreate: UsernamePasswordInput = {
    username,
    password,
  };

  const response = await mutate({
    mutation: queriesAndMutations.REGISTER,
    variables: { options: userToCreate },
  });

  const userResponse: UserResponse = response.data.register;

  return userResponse;
}

beforeAll(async () => {
  //set up database connection
  dbConn = await testConn();
  em = dbConn.em;

  //Setup an Apollo test server
  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: () => ({ em }),
  });

  server = createTestClient(apolloServer);

  await em.nativeDelete(User, {}); //clear all users in test db
});

afterAll(async () => {
  await dbConn.close();
});

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should register a new user successfully ", async () => {
      //Arrange

      //Act
      const registeredUserResponse = await registerUser(
        defaultUserOptions.username,
        defaultUserOptions.password
      );

      let dbUser = await em.findOne(User, {
        id: registeredUserResponse.user?.id,
      });

      //assert
      expect(registeredUserResponse.user).not.toBe(null);
      expect(registeredUserResponse.errors).toBe(null);
      expect(registeredUserResponse.user?.username).toBe("test");
      expect(registeredUserResponse.user?.username).toBe(dbUser?.username);
    });
    test("should log in a new user successfully ", async () => {
      //Arrange
      const { mutate } = server;

      //Act
      const seedUserResponse = await registerUser();
      if (seedUserResponse.user) {
        seedUser = seedUserResponse.user;
      }

      const response = await mutate({
        mutation: queriesAndMutations.LOGIN,
        variables: {
          options: {
            username: seedUserOptions.username,
            password: seedUserOptions.password,
          },
        },
      });

      const loginResponse: UserResponse = response.data.login;
      const loggedInUser = loginResponse.user;

      let dbUser = await em.findOne(User, {
        id: seedUser.id,
      });

      //assert
      expect(loggedInUser).not.toBe(null);
      expect(loggedInUser?.username).toBe(seedUser.username);
      expect(loggedInUser?.id).toBe(dbUser?.id);
    });
  });

  describe("Registration Validations", () => {
    test("should not permit registration with username with lengths <= 2", async () => {
      //Arrange
      const newUser = { ...defaultUserOptions, username: "me" };

      //Act
      const registeredUserResponse = await registerUser(
        newUser.username,
        newUser.password
      );

      const errors = registeredUserResponse.errors;
      const firstError = errors ? errors[0] : null;

      //assert
      expect(registeredUserResponse.user).toBe(null);
      expect(errors).toHaveLength(1);
      expect(firstError).not.toBe(null);
      expect(firstError?.field).toBe("username");
      expect(firstError?.message).toBe("length must be greater than 2");
    });
    test("should not permit registration with password with length < 6", async () => {
      //Arrange
      const newUser = { ...defaultUserOptions, password: "abc" };

      //Act
      const registeredUserResponse = await registerUser(
        newUser.username,
        newUser.password
      );

      const errors = registeredUserResponse.errors;
      const firstError = errors ? errors[0] : null;

      //assert
      expect(registeredUserResponse.user).toBe(null);
      expect(errors).toHaveLength(1);
      expect(firstError).not.toBe(null);
      expect(firstError?.field).toBe("password");
      expect(firstError?.message).toBe("length must be at least 6 characters");
    });
    test("should not permit registration if username exists", async () => {
      //ARRANGE

      //create a seed user to take up the username
      const seedUserResponse = await registerUser();
      if (seedUserResponse.user) {
        seedUser = seedUserResponse.user;
      }
      //new user will attempt registration with the same username as the already created seedUser
      const newUser = { ...seedUserOptions };

      //ACT
      const registeredUserResponse = await registerUser(
        newUser.username,
        newUser.password
      );

      const errors = registeredUserResponse.errors;
      const firstError = errors ? errors[0] : null;

      //ASSERT
      expect(registeredUserResponse.user).toBe(null);
      expect(errors).toHaveLength(1);
      expect(firstError).not.toBe(null);
      expect(firstError?.field).toBe("username");
      expect(firstError?.message).toBe("username already taken.");
    });
  });
});
