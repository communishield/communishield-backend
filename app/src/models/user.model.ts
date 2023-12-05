/* eslint-disable new-cap */
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Group } from "./group.model";
import { FileDescriptor } from "./file-descriptor.model";

@Entity()
export class User {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Property({ unique: true, index: true })
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @ManyToMany(() => Group, (group) => group.users)
  groups = new Collection<Group>(this);

  @OneToMany(() => FileDescriptor, (object) => object.owner)
  ownedObjects = new Collection<FileDescriptor>(this);
}
