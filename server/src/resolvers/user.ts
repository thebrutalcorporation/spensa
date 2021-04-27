import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { COOKIE_NAME } from "../constants";

import { User } from "../entities/User";
import { Context } from "../types/context";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

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
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    if (options.password.length <= 5) {
      //@TODO: add more robust password handling, perhaps magic links
      return {
        errors: [
          {
            field: "password",
            message: "length must be at least 6 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user: User = em.create(User, {
      username: options.username.toLowerCase(),
      password: hashedPassword,
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
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: options.username.toLowerCase(),
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username does not exist!",
          },
        ],
      };
    }

    const isValidPassword = await argon2.verify(
      user.password,
      options.password
    );

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
