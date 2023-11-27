/* eslint-disable new-cap */
import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Directory } from "./directory.model";
import { User } from "./user.model";
import { File } from "./file.model";
import { Permission } from "./permission.model";
import { Group } from "./group.model";

@Entity()
@Unique({ properties: ["name", "parentDirectory"] })
export class FileDescriptor {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Property()
  name!: string;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => Group)
  group!: Group;

  @Property({ type: Permission })
  permissions!: Permission;

  @ManyToOne(() => Directory, { nullable: true, hidden: true })
  parentDirectory?: Directory;

  @OneToOne(() => File, (file) => file.descriptor, { hidden: true })
  file?: File;

  @OneToOne(() => Directory, (directory) => directory.descriptor, {
    hidden: true,
  })
  directory?: Directory;
}
