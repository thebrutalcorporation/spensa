import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity } from "./BaseEntity";
import { v4 } from "uuid";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field(() => String)
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "cascade" })
  user!: User;
}
