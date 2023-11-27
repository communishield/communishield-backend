/* eslint-disable new-cap */
import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
} from "@mikro-orm/core";
import { FileDescriptor } from "./file-descriptor.model";

@Entity()
export class Directory {
  @PrimaryKey({ hidden: true })
  id!: number;

  @OneToMany(() => FileDescriptor, (object) => object.parentDirectory)
  contents = new Collection<FileDescriptor>(this);

  @OneToOne(() => FileDescriptor, (descriptor) => descriptor.directory, {
    owner: true,
  })
  descriptor!: FileDescriptor;
}
