import { MiddlewareFn } from "type-graphql";
import { Context } from "../utils/interfaces/context";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const loggedInUserId = context.req.session.userId;

  if (!loggedInUserId) {
    throw new Error("Not authenticated!");
  }

  return next();
};
