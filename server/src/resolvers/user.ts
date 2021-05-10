import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";

import { User } from "../entities/User";
import { Context } from "../types/context";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async ChangePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em, redis, req }: Context
  ): Promise<UserResponse> {
    //TODO: abstract validations (including validateRegister) into modular functions
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be at least 6 characters",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token expired",
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: userId });

    //it is possible that user was deleted between token sent for change password and attempted use
    //so handle error for this fringe case.
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    //set new password and store in database
    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    await redis.del(key); //destroy key after successful use

    //log in user after successful change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: Context
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      //email is not in the database;
      return false;
    }

    const token = v4(); //generate token as uuids

    //reset token expires in 3-days
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );

    await sendEmail(
      email,
      "Reset Your Password",
      `<a href="http://localhost:3000/change-password/${token}">reset your password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: Context) {
    //not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const errors = await validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user: User = em.create(User, {
      username: options.username.toLowerCase(),
      password: hashedPassword,
      email: options.email.toLowerCase(),
    });

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      //duplicate username
      if (error.code == "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken.",
            },
          ],
        };
      }
    }

    //set session cookie to automatically log in new user
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? {
            email: usernameOrEmail.toLowerCase(),
          }
        : { username: usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "user does not exist!",
          },
        ],
      };
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid login!",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
