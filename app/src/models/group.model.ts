/* eslint-disable new-cap */
import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./user.model";

@Entity()
export class Group {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Property({ unique: true })
  name!: string;

  @ManyToMany(() => User, (user) => user.groups, { owner: true })
  users = new Collection<User>(this);
}
