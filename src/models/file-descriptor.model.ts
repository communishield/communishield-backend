/* eslint-disable new-cap */
import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Directory } from "./directory.model";
import { User } from "./user.model";
import { File } from "./file.model";
import { Permission } from "./permission.model";
import { Group } from "./group.model";

@Entity()
export class FileDescriptor {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => Group)
  group!: Group;

  @Property({ type: Permission })
  permissions!: Permission;

  @ManyToOne(() => Directory)
  parentDirectory!: Directory;

  @OneToOne(() => File, (file) => file.descriptor)
  file?: File;

  @OneToOne(() => Directory, (directory) => directory.descriptor)
  directory?: Directory;
}
