import { Ctx, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { Context } from "../utils/interfaces/context";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  categories(@Ctx() { em }: Context): Promise<Category[]> {
    return em.find(Category, {});
  }
}
