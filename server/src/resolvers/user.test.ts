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

import { testConn } from "../test-utils/testConn";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "../utils/createSchema";
import { UserResponse } from "./user";
import { User } from "../entities/User";
import { genUserOptions } from "../test-utils/factories";
import { USER_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";

let dbConn: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let server: ApolloServerTestClient;

describe("Transaction Resolver", () => {
  describe("Happy Path", () => {
    test("should register a new user successfully ", async () => {
      //Arrange
      const userToRegister = genUserOptions();

      //Act
      const registeredUserResponse = await registerUser(
        userToRegister.username,
        userToRegister.password,
        userToRegister.email
      );

      const dbUser = await em.findOne(User, {
        id: registeredUserResponse.user?.id,
      });

      //assert
      expect(registeredUserResponse.user).not.toBe(null);
      expect(registeredUserResponse.errors).toBe(null);
      expect(registeredUserResponse.user?.username).not.toBe(null);
      expect(registeredUserResponse.user?.username).toBe(dbUser?.username);
    });
    test("should log in a new user successfully ", async () => {
      //ARRANGE
      const { mutate } = server;

      //[ARRANGE] Register user that will be logged in
      const user = genUserOptions();
      await registerUser(user.username, user.password, user.email);

      const response = await mutate({
        mutation: USER_QUERIES_AND_MUTATIONS.LOGIN,
        variables: {
          usernameOrEmail: user.username,
          password: user.password,
        },
      });

      const loginResponse: UserResponse = response.data.login;
      const loggedInUser = loginResponse.user;

      const dbUser = await em.findOne(User, {
        id: loggedInUser?.id,
      });

      //assert
      expect(loggedInUser).not.toBe(null);
      expect(loggedInUser?.username).toBe(user.username);
      expect(loggedInUser?.id).toBe(dbUser?.id);
    });
    xtest("should return current user if logged in", async () => {
      // //session cookie set on user's machine if logged in.
      // //session exists if cookie exists
      // //ARRANGE
      // const { query, mutate } = server;
      // const userOptions = genUserOptions();
      // await registerUser(userOptions.username, userOptions.password);
      // const response = await mutate({
      //   mutation: USER_QUERIES_AND_MUTATIONS.LOGIN,
      //   variables: {
      //     options: {
      //       username: userOptions.username,
      //       password: userOptions.password,
      //     },
      //   },
      // });
      // const loginResponse: UserResponse = response.data.login;
      // const loggedInUser = loginResponse.user;
      // //ACT
      // const res = await query({
      //   query: USER_QUERIES_AND_MUTATIONS.ME,
      // });
      // // console.log(res.data.me);
      // //ASSERT
      // expect(true).toBe(true);
    });
  });

  describe("Registration Validations", () => {
    test("should not permit registration with username with lengths <= 2", async () => {
      //Arrange
      const defaultUserOptions = genUserOptions();
      const newUser = { ...defaultUserOptions, username: "me" };

      //Act
      const registeredUserResponse = await registerUser(
        newUser.username,
        newUser.password,
        newUser.email
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
      const defaultUserOptions = genUserOptions();
      const newUser = { ...defaultUserOptions, password: "abc" };

      //Act
      const registeredUserResponse = await registerUser(
        newUser.username,
        newUser.password,
        newUser.email
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
      const userToRegister = genUserOptions();

      //Register a user to take up username
      await registerUser(
        userToRegister.username,
        userToRegister.password,
        userToRegister.email
      );

      //new user will attempt registration with the same username as the already created seedUser
      const newUserToRegister = { ...userToRegister };

      //ACT
      const duplicateRegisteredUserResponse = await registerUser(
        newUserToRegister.username,
        newUserToRegister.password,
        newUserToRegister.email
      );

      const errors = duplicateRegisteredUserResponse.errors;
      const firstError = errors ? errors[0] : null;

      //ASSERT
      expect(duplicateRegisteredUserResponse.user).toBe(null);
      expect(errors).toHaveLength(1);
      expect(firstError).not.toBe(null);
      expect(firstError?.field).toBe("username");
      expect(firstError?.message).toBe("username already taken.");
    });
  });
  describe("Login Validations", () => {
    test("should not permit login with incorrect username", async () => {
      //ARRANGE
      const { mutate } = server;
      const defaultUserOptions = genUserOptions();
      const newUser = { ...defaultUserOptions, username: "nonexistent" };
      const expectedErrors = [
        { field: "usernameOrEmail", message: "username does not exist!" },
      ];

      //ACT
      const response = await mutate({
        mutation: USER_QUERIES_AND_MUTATIONS.LOGIN,
        variables: {
          usernameOrEmail: newUser.username,
          password: newUser.password,
        },
      });

      console.log(response.data);

      const loginResponse: UserResponse = response.data.login;
      const errors = loginResponse.errors;

      //ASSERT
      expect(loginResponse.user).toBe(null);
      expect(errors).not.toBe(null);
      expect(errors).toEqual(expect.arrayContaining(expectedErrors));
    });
    test("should not permit login with incorrect password", async () => {
      //ARRANGE
      const { mutate } = server;
      const userToRegister = genUserOptions();
      //register user with a username + password
      await registerUser(
        userToRegister.username,
        userToRegister.password,
        userToRegister.email
      );

      //correct username but wrong password
      const userWrongPassword = {
        ...userToRegister,
        password: "wrongpassword",
      };
      const expectedErrors = [{ field: "password", message: "Invalid login!" }];

      //ACT
      const response = await mutate({
        mutation: USER_QUERIES_AND_MUTATIONS.LOGIN,
        variables: {
          usernameOrEmail: userWrongPassword.username,
          password: userWrongPassword.password,
        },
      });

      const loginResponse: UserResponse = response.data.login;
      const errors = loginResponse.errors;

      //ASSERT
      expect(loginResponse.user).toBe(null);
      expect(errors).not.toBe(null);
      expect(errors).toEqual(expect.arrayContaining(expectedErrors));
    });
  });
});

beforeAll(async () => {
  //set up database connection
  dbConn = await testConn();
  em = dbConn.em;

  //TODO: in order to inject context, you need to make creating a test server something you can invoke FOR EACH test
  //Check https://github.com/apollographql/fullstack-tutorial/blob/b25df2e9fd45ec5bcd07e4c2f34b79b7a8bd0817/final/server/src/__tests__/__utils.js#L21
  //TODO: Or just re-write using this project which solves the req in context issue: https://github.com/zapier/apollo-server-integration-testing
  //Setup an Apollo test server
  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: () => ({
      em,
      req: { session: {} },
    }), //@TODO is this the best way?
  });

  server = createTestClient(apolloServer);

  await em.nativeDelete(User, {}); //clear all users in test db
});

afterAll(async () => {
  await dbConn.close();
});

async function registerUser(username: string, password: string, email: string) {
  const { mutate } = server;
  const userToCreate = {
    username,
    password,
    email,
  };

  const response = await mutate({
    mutation: USER_QUERIES_AND_MUTATIONS.REGISTER,
    variables: { options: userToCreate },
  });

  const userResponse: UserResponse = response.data.register;

  return userResponse;
}
