import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import {
  createTestClient,
  TestQuery,
  TestSetOptions,
} from "apollo-server-integration-testing";
import "dotenv/config";
import { Server } from "http";
import "reflect-metadata";
import { v4 } from "uuid";
import Application from "../application";
import { User } from "../entities/User";
import { genUserOptions } from "../test-utils/factories";
import { USER_QUERIES_AND_MUTATIONS } from "../test-utils/queries-mutations";
import { clearDatabase } from "../test-utils/services/clearDatabase";
import { loadFixtures } from "../test-utils/services/loadFixtures";
import { sendEmail } from "../utils/sendEmail";
import { UserResponse } from "./user";

jest.mock("../utils/sendEmail", () => {
  return {
    sendEmail: jest.fn(),
  };
});

let serverConnection: Server;
let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>; //entity manager for ORM
let testClientQuery: TestQuery;
let testClientMutate: TestQuery;
let testClientSetOptions: TestSetOptions;

describe("User Resolver", () => {
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
    test("should log in a new user successfully with username ", async () => {
      //ARRANGE
      const user = genUserOptions();
      await registerUser(user.username, user.password, user.email);

      //ACT
      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: user.username,
            password: user.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const loggedInUser = loginResponse.user;

      const dbUser = await em.findOne(User, {
        id: loggedInUser?.id,
      });

      //assert
      expect(loggedInUser).not.toBe(null);
      expect(loggedInUser?.username).toBe(user.username);
      expect(loggedInUser?.id).toBe(dbUser?.id);
    });
    test("should log in a new user successfully with email ", async () => {
      //ARRANGE
      const user = genUserOptions();
      await registerUser(user.username, user.password, user.email);

      //ACT
      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: user.email,
            password: user.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const loggedInUser = loginResponse.user;

      const dbUser = await em.findOne(User, {
        id: loggedInUser?.id,
      });

      //assert
      expect(loggedInUser).not.toBe(null);
      expect(loggedInUser?.username).toBe(user.username);
      expect(loggedInUser?.id).toBe(dbUser?.id);
    });
    test("should return current user if logged in", async () => {
      //session cookie set on user's machine if logged in.
      //session exists if cookie exists
      //ARRANGE
      const userOptions = genUserOptions();
      await registerUser(
        userOptions.username,
        userOptions.password,
        userOptions.email
      );

      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: userOptions.username,
            password: userOptions.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const loggedInUser = loginResponse.user;

      //ACT
      const res = await testClientQuery(USER_QUERIES_AND_MUTATIONS.ME);
      const me = (res.data as any)?.me;

      //ASSERT
      expect(me.id).toBe(loggedInUser?.id);
    });
    test("should log out a user successfull ", async () => {
      //ARRANGE
      //Set mocks
      testClientSetOptions({
        request: {
          session: {
            destroy: jest.fn((cb) => cb()),
          },
        },
      });
      //gen random user
      const user = genUserOptions();

      //register new user, which logs in automatically by default
      await registerUser(user.username, user.password, user.email);

      //ACT
      const logoutResponse = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGOUT
      );

      //assert
      expect((logoutResponse.data as any)?.logout).toBe(true);
    });
    test("should send a forgot password email if requested ", async () => {
      //ARRANGE
      //gen random user
      const user = genUserOptions();

      //register new user
      await registerUser(user.username, user.password, user.email);

      //ACT
      const forgotPasswordResponse = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.FORGOT_PASSWORD,
        {
          variables: { email: user.email },
        }
      );

      //assert
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect((forgotPasswordResponse.data as any)?.forgotPassword).toBe(true);
    });
    xtest("should allow users to change their password", async () => {
      //ARRANGE
      (v4 as jest.Mock).mockImplementation(
        () => "e4b3a253-a1d1-4331-bf45-eb68afeb91b9"
      );

      //gen random user
      const user = genUserOptions();

      //register new user
      await registerUser(user.username, user.password, user.email);

      //trigger forgot password to associate token with user
      await testClientMutate(USER_QUERIES_AND_MUTATIONS.FORGOT_PASSWORD, {
        variables: { email: user.email },
      });

      //generate mocked token and new password
      const token = v4();
      const newPassword = "newPassword911";

      //ACT
      const changePasswordResponse = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.CHANGE_PASSWORD,
        {
          variables: { token, newPassword },
        }
      );

      //ASSERT
      //This login attempt uses the old password and should fail
      const loginResponseOldPassword = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: user.username,
            password: user.password,
          },
        }
      );

      const oldPwdLoginAttempt = (loginResponseOldPassword.data as any)?.login;

      //This login attempt uses the new password and should succeed
      const loginResponseNewPassword = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: user.username,
            password: newPassword,
          },
        }
      );

      const newPwdLoginAttempt = (loginResponseNewPassword.data as any)?.login;

      expect(
        (changePasswordResponse.data as any)?.ChangePassword.user
      ).not.toBe(null);
      expect(
        (changePasswordResponse.data as any)?.ChangePassword.user.username
      ).toBe(user.username);
      expect(oldPwdLoginAttempt.user).toBe(null);
      expect(newPwdLoginAttempt.user).not.toBe(null);
      expect(newPwdLoginAttempt.user.username).toBe(user.username);
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
    test("should not permit registration with invalid email", async () => {
      //Arrange
      const defaultUserOptions = genUserOptions();
      const invalidEmails = [
        "email",
        "email@",
        "email@test",
        "mail@gooogle.com",
        "email@mailinator.com",
      ];

      //Act
      const registrationResponses = await Promise.all(
        invalidEmails.map(async (email) => {
          const newUser = {
            ...defaultUserOptions,
            email,
          };
          const registeredUserResponse = await registerUser(
            newUser.username,
            newUser.password,
            newUser.email
          );
          return registeredUserResponse;
        })
      );

      //assert
      registrationResponses.forEach((response) => {
        const errors = response.errors;
        const firstError = errors ? errors[0] : null;

        expect(response.user).toBe(null);
        expect(errors).toHaveLength(1);
        expect(firstError).not.toBe(null);
        expect(firstError?.field).toBe("email");
        expect(firstError?.message).toBe("invalid email");
      });
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
      const defaultUserOptions = genUserOptions();
      const newUser = { ...defaultUserOptions, username: "nonexistent" };
      const expectedErrors = [
        { field: "usernameOrEmail", message: "user does not exist!" },
      ];

      //ACT
      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: newUser.username,
            password: newUser.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const errors = loginResponse.errors;

      //ASSERT
      expect(loginResponse.user).toBe(null);
      expect(errors).not.toBe(null);
      expect(errors).toEqual(expect.arrayContaining(expectedErrors));
    });
    test("should not permit login with incorrect email", async () => {
      //ARRANGE
      const defaultUserOptions = genUserOptions();
      const newUser = {
        ...defaultUserOptions,
        email: "incorrectemail@test.com",
      };
      const expectedErrors = [
        { field: "usernameOrEmail", message: "user does not exist!" },
      ];

      //ACT
      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: newUser.email,
            password: newUser.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const errors = loginResponse.errors;

      //ASSERT
      expect(loginResponse.user).toBe(null);
      expect(errors).not.toBe(null);
      expect(errors).toEqual(expect.arrayContaining(expectedErrors));
    });
    test("should not permit login with incorrect password", async () => {
      //ARRANGE
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
      const response = await testClientMutate(
        USER_QUERIES_AND_MUTATIONS.LOGIN,
        {
          variables: {
            usernameOrEmail: userWrongPassword.username,
            password: userWrongPassword.password,
          },
        }
      );

      const loginResponse: UserResponse = (response.data as any)?.login;
      const errors = loginResponse.errors;

      //ASSERT
      expect(loginResponse.user).toBe(null);
      expect(errors).not.toBe(null);
      expect(errors).toEqual(expect.arrayContaining(expectedErrors));
    });
  });
});

beforeEach(async () => {
  jest.resetAllMocks();
  await clearDatabase(orm);
  await loadFixtures(orm);
});

beforeAll(async () => {
  const application = Application();
  await application.connect();
  await application.init();
  orm = await application.getOrm();
  const apolloServer = await application.getApolloServer();

  // make available to other scopes
  serverConnection = await application.getServerConnection();
  serverConnection.close();
  em = orm.em.fork();

  const { query, mutate, setOptions } = createTestClient({
    apolloServer,
    extendMockRequest: {
      session: {
        userId: null,
      },
    },
  });

  //Set values to variables for use in other tests
  testClientMutate = mutate;
  testClientQuery = query;
  testClientSetOptions = setOptions;

  await clearDatabase(orm);
  await loadFixtures(orm);
});

afterAll(async () => {
  await orm.close();
  serverConnection.close();
});

async function registerUser(username: string, password: string, email: string) {
  const userToCreate = {
    username,
    password,
    email,
  };

  const response = await testClientMutate(USER_QUERIES_AND_MUTATIONS.REGISTER, {
    variables: { options: userToCreate },
  });

  const userResponse: UserResponse = (response.data as any)?.register;

  return userResponse;
}
